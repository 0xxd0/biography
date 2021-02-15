---
title: 再谈 Swift Performance
subtitle: 如何优化 Swift Performance

# Summary for listings and search engines
summary: 如何优化 Swift Performance

# Link this post with a project
projects: []

# Date published
date: 2016-11-26T18:00:05Z

# Date updated
lastmod: 2016-11-26T19:00:05Z

# Is this an unpublished draft?
draft: false

# Show this page in the Featured widget?
featured: false

# Featured image
# Place an image named `featured.jpg/png` in this page's folder and customize its options here.
image:
  caption: ''
  focal_point: "Smart"
  placement: 1
  preview_only: false

authors:
- admin

tags:
- Swift
- Compiler

categories:
- Computer Science 
- PL. Programming Languages
- The Swift Programming Language
---

随着 WWDC 2016 的离去，WWDC 2017 也已悄然竟接近，明年苹果将重回加州圣何塞 `McEnery` 举办开发者大会，这个时候那些该展望的、还没展望的，也基本被讨论的差不多了，虽然在这个时间点来讨论 Swift Performance 虽然有些老生常谈，但也不失为一个好的话题。

## `class` 与 `struct` 的取舍

什么情况下该用哪种 `first class type` 来建立我们的 `Model`，虽然各路英才心里自有图谱，但还是很有必要拉出来讨论一下。到底是用 `class` 还是 `struct`、用 `value` 还是 `reference` ，关键的约束点在于性能开销与多态的实现方式。

### 内存分配

人尽皆知 `heap` 比 `stack` 更昂贵，`heap` 牺牲了性能以换取比 `stack` 更自由的内存管理，`stack` 牺牲了复杂的数据结构来获取和 `Int` 赋值一样快的 allocation。

`heap` 之所以昂贵、性能开销大，是因为开辟内存时需要考虑到多线程申请同一块内存 `block` 而产生的竞争问题，因此首先需要加锁来达到 Thread Safety，然后，需要去找到未被使用使用的内存并申请初始化，用完了之后还得还回去将其 deallocate，而我们能得到的好处则是更加动态的内存生命周期。并且不像 C++，Swift 只能在堆上初始化 `class`，对于 `class` 选型的取舍显得尤其重要。

反观 `stack`，之所以其性能好是因为其开辟内存仅仅依赖于 `ESP` 的上下移动，以典型自底向上的栈结构为例，一次函数调用所需要的 stack allocate 仅仅需要上移 `ESP`，而当函数体结束时再把 `ESP` 指回入栈之前的位置，上段内存自然就 deallocate 了。每个线程有自己的 `stack`，不要考虑多线程加锁，也不需要考虑下一块内存是否可用。但限制在于，当执行一次完整的 `call stack`，`EBP` 的位置是固定的，意味着可以使用内存就这点，所以在栈上能做的事就被大大的限制，否则就等着 Overflow。

```swift
struct Car {
    var serial: Int 
}

let car = Car(serial: 123456)
// Fake car, have a fake serial, which is equal to car.serial
let fakeCar = aCar
// do sth with car, fakeCar

```

这样一段代码在 `stack` 上仅仅用了 2 个字的大小，用于存储两个 `car` 的 `serial`。就轻量级，开销低这些特点来说，在工程中用 `struct` 来建模看上去是挺美滋滋的，但抛开多态单就性能来说，是否意味着 `struct` 总是能成为 `Modeling` 的首选？答案是否定的，当 `struct` 遇见 `ARC` 时，她就变得并不那么轻量级了。

### `ARC`

Swift 对于 `heap` 上实例的内存管理，采用的机制依旧是 `ARC`。

ARC 的在性能上的开销主要是在 `swift_retain` & `swift_release` 所产生的多次 `indirection` 以及多线程的加锁保护。对于 `trivial` 的 `struct` 来说因为不涉及 `ARC`，因此没有影响。但当 `struct` 本身如果包含了需要 `ARC` 的实例时，他就变得不那么高效了。

```swift
struct Car {
    var name: String
    var model: String
}

let newCar = Car(name: "Tesla", model: "Model S")
let myCar = newCar
print(myCar.name)
```

就 `Car` 来说，`name` 和 `model` 虽然是 `String`， 是一个 `struct`，但是 `String` 的 `underlying buffer storage` 是开辟在堆上的，需要和 `Class` 一样的作 `retain count`，所以会产生如下所示代码。

```swift
struct Car {
    var name: String
    var model: String
}

let newCar = Car(name: "Tesla", model: "Model S")
let myCar = newCar

print(myCar.name)
 
swift_retain(myCar.name._storage)
swift_retain(myCar.model._storage)
 
swift_release(myCar.name._storage)
swift_release(myCar.model._storage)
 
swift_release(newCar.name._storage)
swift_release(newCar.model._storage)

```

过多的 `retain` & `release` 带来性能开销是我们不想看到的，而如果我们采用 `class` 来实现则展开成如下形式。

```swift
class Car {
    var name: String
    var model: String
    
    init(name: String, model: String) {
        self.name = name
        self.model = model
    }
}

let newCar = Car(name: "Tesla", model: "Model S")
let myCar = newCar
swift_retain(myCar)
print(myCar.name)
swift_retain(myCar)

// ... do sth

swift_release(myCar)
swift_release(newCar)

```

在实际的过程中，`Model` 显然不会这么简单，一个对象上有 10 几 20 个需要的 `ARC` 的 `property` 也不是不可能的，这时候谨慎使用 `struct` 是我们需要注意的雷区。

一个好的实践是多用 `built-in` 的 `type` 和结构来构建模型，比如 `Car.model`，作为一个 `String`，它其实没有很好的约束 `Car.model` 所想表达的内容，它可以是任何字符串例如 `Car.model = "foo"`，这是一个非常差的设计。因此如下所示，在这里我们可以采用 `enum` 来对 `model` 做约束。

```swift
extension Car {
    enum Model {
        case s
        case x
    }
}

struct Car {
    var name: String
    var model: Car.Model
}
```

虽然是一个很小的优化点，但结果即提高了语义的清晰度，又减少了不必要的开销，可谓一石双鸟。

## 多态

`Dyanmic Dispatch` 作为类多态实现的基础之一，也是讨论了比较多的话题，对于 `class` 来说，编译器会给其添加额外的 `field` 来储存 `Type` 的信息，`runtime` 通过 `Type` 的 `v-table` 来找到对应的方法，具体关于 `Dynamic Dispatch` 的讨论可见之前的 [Whole Module Optimization 分析](../whole-module-optimizations/)，这里就不再赘述。

回到 `struct`，如果我们需要在 `struct` 上实现多态，那就得依靠 `protocol` 来实现。

```swift
protocol Turboable {
    
    func turbo()
}

func turbo(_ stuffs: [Turboable]) {
    stuffs.forEach {
        $0.turbo()
    }
}

struct Car {
    var name: String
}

extension Car: Turboable {
    
    func turbo() {
        print("turbo Car")
    }
}

struct Jet {
    var name: String
}

extension Jet: Turboable {
    
    func turbo() {
        print("turbo Jet")
    }
}

struct Tractor {
    var name: String
    var serail: Int
}

extension Tractor: Turboable {
    
    func turbo() {
        print("turbo Tractor")
    }
}

let myStuffs: [Turboable] = [
    Jet(name: "MiG-25"), 
    Car(name: "Chevrolet"), 
    Tractor(name: "Mercedes-Benz",serial: 1)
]
turbo(myStuffs)
```

这是一段很常见的 `Protocol Oriented Programming`，实际上这并不是没有额外性能开销的。和 `Class` 不一样，通过 `protocol` 实现的多态是通过 `Protocol Witness Table` 来做 `Dispatch`，每一个实现了 `Turboable` 的类型，编译器都会生成一份 `PWT`。

```swift
struct JetPWT {
    func turbo(_ jet: Jet) {
        jet.turbo()
    }
}

struct CarPWT {
    func turbo(_ car: Car) {
        car.turbo()
    }
}

struct TractorPWT {
    func turbo(_ tractor: Tractor) {
        tractor.turbo()
    }
}
```

同时对于 `Array`，底层的 `buffer` 显然更喜欢以固定的大小去连续的存储元素，而不同的 `type` 却有着不同的内存布局，因此 Swift 使用了 `Existential Containner` 去存储元素，这样一个容器提供了个三个字大小的 `value Buffer` 用于存储元素。

但如果元素的内存布局过大导致 `value Buffer` 放不下，例如三个字对于 `struct Jet` 足够大，但对于 `struct Tractor`，因为 `String`.`size` + `Int`.`size` > 3 使得它无法存放在只有三个字大小的 `buffer` 中。

```swift
// 24 bytes, 3 word
let jetSize = MemoryLayout<Jet>.size

// 32 bytes, 4 words
let tractorSize = MemoryLayout<Tractor>.size
```


因此 `Existential Containner` 会在堆上开辟空间用来拷贝存储一份 `Tractor`，同时将指针存放在 `value Buffer` 中。

所以调用 `func turbo(_ stuffs: [Turboable])` 实际上绝大部分的性能开销都花费在对结构体进行内存分配上。

同时，谈及了内存操作，不同的 `type` 对应的内存布局是不同的，`Existential Containner` 需要额外信息才能为这些 `type` 做堆内存初始化、拷贝、释放，因此 Swift 引入了 `Value Witness Table` 来管理 `value type` 在堆上的生命周期。

```swift 
struct JetVWT {

    // 在堆上初始化一块用于存放 Jet 的内存，并把地址赋给 Existential Containner
    func allocate() 
    // 把 stack Jet 的内存 copy 到 heap 上
    func copy()
    // 用于 class type 引用计数递减
    func destruct()
    // 释放堆内存
    func deallocate()
}

struct CarVWT {
    ...
}

struct TractorVWT {
    ...
}
```

因此 `Existential Containner` 还需要额外的两个字的空间用来存放 `PWT` 和 `VWT` 的地址。

```swift
struct ExistContTurboable {
   var valueBuffer: (Int, Int, Int)
   var vwt: ValueWitnessTable
   var pwt: TurboableProtocolWitnessTable
}
```

通常来说 `Existential Containner` 的大小是 5 个字。

```
// 40 bytes, 5 words
let turboableSize = MemoryLayout<Turboable>.size
```

虽然官方没声明，但是多个 `protocol` 的情况下一份 `pwt` 应该是不够的。

```swift 
// 48 bytes, 6 words
let turboableSize = MemoryLayout<Turboable & CustomReflectable>.size
```

所以多个 `protocol` 的结构会是如下所示的布局。

```swift
struct ExistContTurboableCustomReflectable {
    var valueBuffer: (Int, Int, Int)
    var vwt: ValueWitnessTable
    var pwt: (TurboableProtocolWitnessTable, CustomReflectableWitnessTable)
}
```

以上整个流程实现了 `protocol` 的 `Dynamic Dispatch`，那么最终 `func turbo(_ stuffs: [Turboable])` 会生成下文所示的伪代码。

```swift

func turbo(val: [ExistContTurboable]) {
    val.forEach { element in
        // on the heap
        var local = ExistContTurboable()
        let vwt = element.vwt
        let pwt = element.pwt
        local.vwt = vwt
        local.pwt = pwt
        // 拷贝 local var 至 valueBuffer 或者堆上的内存
        vwt.allocateBufferAndCopyValue(&local, element)
        // 获取到 valueBuffer 或者堆上的实例
        pwt.turbo(vwt.projectBuffer(&local))
        // 清理现场
        vwt.destructAndDeallocateBuffer()
    }
}
```

相比于 `class`，通过 `protocol` 实现的 `Dynamic Dispatch` 所带来的性能下降根据数据大小的不同可能高达数倍，并且不仅仅是 `protocol type`，也包括了 `stdlib` 中的一些函数。

```swift
public func max<T>(_ x: T, _ y: T) -> T where T : Comparable
```

这是一个很典型的范型函数，编译器在优化 Scope 被限制的条件下，会保守的生成符合所有 case 的函数。

```swift
public func max<T>(_ x: T, _ y: T, _ pwt: TypePWT, _ vwt: TypeVWT) -> T where T : Comparable
```

同样用到了 `PWT` 和 `VWT`，函数体的内部也同样用 `valueBuffer` 来存储数据，一样是 3 个字的大小（苹果估计和 G 胖有仇），唯一的区别是没用 `Existential Container` 到，因为这个对于每次调用只有一种 `type` 的参数是没有必要的。

当然这种通过范型实现的 `Static Polymorphism` 仍然是 `Dynamic Dispathc` 虽然对性能开销有影响，但是通过 `Generic Specialization` 可以使其达到 `Static Dispathc`，同样之前的 [Whole Module Optimization 分析](../whole-module-optimizations/) 有提及，所以不再赘述。


{{% callout note %}}
2017-07-14 Updated
{{% /callout %}}

在 WWDC 2017 上，苹果终于出手这个解决 `valueBuffer` 的性能问题了，`Unpredictable Performance Cliff`。苹果的方案是采用 `COW Existential Buffers`，简单来说就是太大没法放进 `valueBuffer` 的 value，苹果对其采用和类一样的 `reference counting`，多个 `Existential Container` 可以共享相同的 `buffer` 直到这个 value 需要被修改才会被重新分配内存，以减少 `heap allocation` 的次数，典型的 COW 机制。

同样对于范型的 `valueBuffer`，原来的 `heap allocation` 被替换为 `stack allocation`，规避了堆内存管理，这下可以更加肆无忌惮的使用范型和 `protocol` 了。

## 结语

我们数据建模的方式小改动会对性能造成巨大的影响，所以在我们设计每一个代码环节时，我们都有这样思维，这段代码发生了什么、会产生怎么样的性能开销、内存是如何分配的。

在工程中都应该根据实际场景仔细斟酌采取哪种机制来获取优雅的实现，并在此基础上对性能做优化，是需要 `class` 的 OOP 特性，还是 `struct` 的 value 特性，是需要 `protocol` 的更加灵活的 `Dynamic Polymorphism`，还是由范型带来的更加 `static` 的 `Static Polymorphism`。
 
总之还是那句话，工欲善其事，必先利其器，了解你的编译器，这样才能让编译器更好的理解你。

## 参考文献

1. [Understanding Swift Performance](https://developer.apple.com/videos/play/wwdc2016/416/)
2. [What's New in Swift 4](https://developer.apple.com/videos/play/wwdc2017/402/)
3. [Exploring Swift Memory Layout](https://academy.realm.io/posts/goto-mike-ash-exploring-swift-memory-layout/)
4. [Real World Swift Performance](https://academy.realm.io/posts/real-world-swift-performance/)