---
title: 快速枚举与迭代器
subtitle: 探究 NSFastEnumeration 的实现
summary: NSFastEnumeration 的实现原理
projects: []
date: 2016-01-25T00:00:00.000Z
lastmod: 2016-01-25T01:49:09.000Z
draft: false
featured: false
cip_code: '11.0701'
image:
  caption: Objective-C, NSFastEnumeration
  focal_point: Smart
  placement: 1
  preview_only: false
authors:
- admin
tags:
- Objective-C
- Swift
categories:
- PL. Programming Languages
- The Swift Programming Language
- The Objective-C Programming Language
cips:
- 11.07) Computer Science
- 11.0701) Computer Science
---


## Swift 中的快速枚举

### Swift 中的 `for...in`

在 Swift 中所有实现了 `Sequence` 的类型都能用 `for...in` 来进行快速枚举，究其根本是因为 `Sequence` 都实现了一个迭代器 `func makeIterator() -> Iterator: IteratorProtocol`，我们实现一个支持随机枚举的类型。

```swift
// 首先定义一个随机迭代器
struct RandomIterator<T>: IteratorProtocol {

    typealias Element = T

    private var elements: [Element]

    private var index: Int = 0

    init(_ elements: [Element]) {
        self.elements = elements
    }

    mutating func next() -> T? {
        guard elements.count > 0 else {
            return nil
        }
        index = Int(arc4random_uniform(UInt32(elements.count)));
        let element = elements[index]
        defer {
            elements.remove(at: index)
        }
        return element;
    }
}

// 定义一个随机序列
struct RandomSequence<T>: Sequence {
    
    typealias Element = T
    
    private var elements: [Element]
    
    init(_ elements: [Element]) {
        self.elements = elements
    }
    
    typealias Iterator = RandomIterator<Element>
    
    func makeIterator() -> Iterator {
        return RandomIterator(elements)
    }
}

```

输出为如下所示。

```swift
let seq = RandomSequence([1, 2, 3, 4, 5, 6, 7, 8, 9])
let loopBegin = { print("========= loop =========") }
loopBegin()
for (i, e) in seq.enumerated() {
    print("Elemet \(i) is \(e)")
}
loopBegin()
for (i, e) in seq.enumerated() {
    print("Elemet \(i) is \(e)")
}

// terminal
========= loop =========
Elemet 0 is 7
Elemet 1 is 8
Elemet 2 is 2
Elemet 3 is 4
Elemet 4 is 5
Elemet 5 is 1
Elemet 6 is 3
Elemet 7 is 9
Elemet 8 is 6
========= loop =========
Elemet 0 is 3
Elemet 1 is 6
Elemet 2 is 7
Elemet 3 is 4
Elemet 4 is 5
Elemet 5 is 9
Elemet 6 is 2
Elemet 7 is 1
Elemet 8 is 8
```


### Swift 下的 `for...in` 展开

Swift 下 `for...in` 最终会被展开成如下代码。

```swift
var iterator = seq.makeIterator()
while let element = iterator.next() {
    print(element)
}
```


## Cocoa 中的 `NSFastEnumeration`

谈到 Cocoa 的 `for...in`，自然会联系到 `@protocol NSFastEnumeration`，其只一个方法需要实现。

```objc
typedef struct {
    unsigned long state;
    id __unsafe_unretained _Nullable * _Nullable itemsPtr;
    unsigned long * _Nullable mutationsPtr;
    unsigned long extra[5];
} NSFastEnumerationState; 

@protocol NSFastEnumeration

- (NSUInteger)countByEnumeratingWithState:(NSFastEnumerationState *)state objects:(id __unsafe_unretained _Nullable [_Nonnull])buffer count:(NSUInteger)len;

@end
```

- `@param state` 它保存了整个快速枚举过程所需要的 `Context`
    - `itemsPtr` 迭代元素的数组
    - `mutationsPtr` 一个标识符用于保证在枚举过程中的集合不被修改，这也是为什么在 `for...in` Loop 中修改 `Mutable Collection` 会导致 Crash 的原因
    - `state` 和 `extra` 保留字段，用于给 `Iterator` 保存上下文的信息
- `@param buffer` 缓冲区，用于存放当前需要被迭代的元素
- `@param len` 缓冲区的长度
- `@return` 当前迭代缓冲区的元素个数，如果是 0 表示迭代完成

### `@protocol NSFastEnumeration` 与 `for...in`

一段 `for...in` Loop。

```objc
id<NSFastEnumeration> enumatable;
for (id element in enumatable) {
    NSLog(@"%@", element);
}
```

`$ clang -rewrite-objc main.m` 之后如下所示：

```cpp
id/*<NSFastEnumeration>*/ enumatable;
{
    id element;

    // 初始化 NSFastEnumerationState Context
    struct __objcFastEnumerationState enumState = { 0 };
    // 开辟一块 size = 16 的缓冲区，用于给 Iterator 填充每次被迭代的元素
    id __rw_items[16];
    // 被迭代的集合
    id l_collection = (id) enumatable;
    // 首次迭代，向实现了 NSFastEnumeration 的该集合对象对象发送消息 "countByEnumeratingWithState:objects:count:"
    _WIN_NSUInteger limit =
        ((_WIN_NSUInteger (*) (id, SEL, struct __objcFastEnumerationState *, id *, _WIN_NSUInteger))(void *)objc_msgSend)
        ((id)l_collection,
        sel_registerName("countByEnumeratingWithState:objects:count:"),
        &enumState, (id *)__rw_items, (_WIN_NSUInteger)16);
    // 检查 ret == 0 ?，如果为 0 表示迭代结束
    if (limit) {
        // 获取 Mutations flag，用于集合修改校验
        unsigned long startMutations = *enumState.mutationsPtr;
        do {
            unsigned long counter = 0;
            do {
                // 保证集合不被修改，否则抛出异常
                if (startMutations != *enumState.mutationsPtr) objc_enumerationMutation(l_collection);
                // 获取枚举的元素
                element = (id)enumState.itemsPtr[counter++];
                // for...in 的 body
                NSLog((NSString *)&__NSConstantStringImpl__var_folders__7_td3r8r7j44s2gh39zqkkhlym0000gn_T_main_b0cf04_mi_0, element);
            } while (counter < limit);
        // 当前元素遍历完毕，开始下一次迭代
        } while (
            (limit = ((_WIN_NSUInteger (*) (id, SEL, struct __objcFastEnumerationState *, id *, _WIN_NSUInteger))(void *)objc_msgSend)
            ((id)l_collection,
            sel_registerName("countByEnumeratingWithState:objects:count:"),
            &enumState, (id *)__rw_items, (_WIN_NSUInteger)16))
        );
        element = ((id)0)
    } else {
        element = ((id)0);
    }
}
```

简而言之，在完整的迭代流程中，每次会给 Iterator 传入一个缓冲区 `buffer`，用于填充需要被迭代的元素，同时会传入一个 `NSFastEnumerationState` 用来提供当前迭代状态的上下文，当该方法返回值 `ret != 0`，表示迭代并没有结束，反之亦然。相比于 `IteratorProtocol` 的单个返回元素，`NSFastEnumeration` 在调用过程中是批量返回元素的，在 `Cocoa` 中和 `IteratorProtocol` 的表现更加类似的则是 `NSEnumerator` 这个抽象类。

```objc
@interface NSEnumerator<ObjectType> : NSObject <NSFastEnumeration>

- (nullable ObjectType)nextObject;

@end
```

### 实现一个基于 `NSFastEnumeration` 的随机迭代器

```objc
// main.mm
@interface RandomIterator: NSObject <NSFastEnumeration>

@property (nonatomic, assign) std::vector<id> elements;
@property (nonatomic, assign) int capicity;

- (id)initWithElements:(NSArray<id> *)elements;

@end

@implementation RandomIterator

- (id)initWithElements:(NSArray<NSObject *> *)elements {
    if ((self = super.init)) {
        for (auto e in elements) {
            _elements.push_back(e);
        }
        _capicity = (int)_elements.size();
    }
    return self;
}

- (NSUInteger)countByEnumeratingWithState:(NSFastEnumerationState *)state objects:(id  _Nullable __unsafe_unretained [])buffer count:(NSUInteger)len {
    auto countOfItemsAlreadyEnumerated = state->state;
    
    // This is the initialization condition, so we'll do one-time setup here.
    if (countOfItemsAlreadyEnumerated == 0) {
        // state->mutationsPtr MUST NOT be NULL and SHOULD NOT be set to self.
        state->mutationsPtr = &state->extra[0];
    }
    
    auto count = 0;
    if (countOfItemsAlreadyEnumerated < _elements.size()) {
        state->itemsPtr = buffer;
        while(count < len) {
            auto randomIndex = (int)arc4random() % MAX(1, (_capicity - 1 - countOfItemsAlreadyEnumerated));
            buffer[countOfItemsAlreadyEnumerated++] = _elements[randomIndex];
            count++;
            if (_elements.size() == 1) {
                break;
            } else {
                _elements.erase(_elements.begin() + randomIndex);
            }
        }
    } else {
        count = 0;
    }
    state->state = countOfItemsAlreadyEnumerated;
    
    return count;
}

@end
```

输出如下

```cpp
int main(int argc, const char * argv[]) {
    auto elements = @[@1, @2, @3, @4, @5, @6, @7, @8, @9];
    id<NSFastEnumeration> enumatable = [RandomIterator.alloc initWithElements: elements];
    for (id element in enumatable) {
        NSLog(@"%@", element);
    }
    return 0;
}

// terminal
Iterator[30557:6346806] 3
Iterator[30557:6346806] 1
Iterator[30557:6346806] 7
Iterator[30557:6346806] 5
Iterator[30557:6346806] 6
Iterator[30557:6346806] 2
Iterator[30557:6346806] 8
Iterator[30557:6346806] 4
Iterator[30557:6346806] 9
```

## 进一步了解

1. [Enumeration Sample](https://developer.apple.com/library/content/samplecode/FastEnumerationSample/Introduction/Intro.html)


