---
title: Objective-C +1s
subtitle: 使 Objective-C 更 Swift

# Summary for listings and search engines
summary: 使 Objective-C 更 Swift

# Link this post with a project
projects: []

# Date published
date: 2016-06-25T10:31:29Z

# Date updated
lastmod: 2016-06-25T11:31:29Z

# Is this an unpublished draft?
draft: false

# Show this page in the Featured widget?
featured: false

# Featured image
# Place an image named `featured.jpg/png` in this page's folder and customize its options here.
image:
  caption: 'Objective-C'
  focal_point: "Smart"
  placement: 1
  preview_only: false

authors:
- admin

tags:
- Objective-C
- Swift

categories:
- Computer Science 
- PL. Programming Languages
- The Objective-C Programming Language
- The Swift Programming Language
---

Swift 3.0 问世之际，随之而来的是 `API` 的清晰语意、更加完备的泛型、更加 Swifty 的 C APIs 等等。标志着 Swift 未来霸主地位越来越难被撼动，那么在 Swift 肆意横行的当下，对于我们的老将我们是否应该问到：

> 廉颇老矣，尚能饭否？

作为一门 1980s 诞生的语言，在 Swift 的蹂躏下，C、ObjC 越发失去生机，`Type Inference` 的缺失、`Dynamic Dispatch` 的性能开销、不安全的 `runtime`，过度啰嗦的 API 设计，都使得其在各方面被 Swift 吊打，大概目前能谈得上优势估计也只剩下强大的 `runtime` 动态性和 C/C++ 混编了。

但尽管 Swift 以其压倒性的语法与性能优势吊打 ObjC，但它也不是没有缺点的。

- 从 Swift 1.0 到 2.3 再到目前的 3.0，Swift 的飞速发展有目共睹，但与此同时其不稳定的 ABI 也一直被开发者诟病，甚至有人戏称 Swift 1.0/2.0/3.0 是三门语言，虽然并没有那么夸张，但其对于代码的冲击性是确确实实的，对于小型团队来说 Swift 的版本迁移可能就几天就解决了，然而对大型项目来说，这个变化是毁灭性的。同时 Swift 部分历史遗留 `bug`、`issue` 没法被很快的解决，那么势必我们会偶然间踩坑，而通常来说，这些迁移所带来的开销在客观环境下是不被允许的。

- Swift 表现和 C++ 在很多地方都十分相似，非常 Static，这也意味着 Swift 在动态性上非常薄弱，stdlib 中的 `Mirror` 相比于 ObjC 的 `runtime`，简直就是在暴打小朋友，就连 `Foundation` 中的 `KVC`、`KVO` 在 Swift 中的都需要用借助 `NSObject` 和 `dynamic` 来完成

- 对于部分一些古老以及有历史原因的框架它们无法从 C/C++ 剥离，而对于 C++，Swift 则必须通过 C、ObjC 来作为桥梁，无形中增加了开发成本，同时 Swift 对于指针的支持特别是函数指针并不是那么的友好，虽然这也无可厚非，毕竟 Swift 强调 `safe`，指针本身就是 `unsafe` 的，但使用上总有那么些许的不流畅。

虽然贬了 Swift 这么多，然而光其强大而优雅的语法特性就是 ObjC 望成莫及的，面对这么强大的晚辈，ObjC 能否续一波命呢？答案是肯定的。得益于 LLVM、Clang、C++ 的诸多特性我们可以把 Swift 中部分的语法糖引入 ObjC。

### Type Inference

在 ObjC 中 `Type Inference` 一直没有很好的解决方案，下方的显示类型声明代码是我们经常需要面对的。

```objc
// File.m
NSArray<NSString *>* array = [[NSArray<NSString *> alloc] init];
```

这很丑，但是我们可以利用 C++ 的 `auto` 来达到目的，于是就变成了如下代码所示。

```objc
// File.mm
auto array = [[NSArray<NSString *> alloc] init];
```

但是这样就得引入 C++，对于很多场景下这是没必要的，好在得益于 Clang 将这个特性带入了 pure C，使得我们能在 C 代码中使用 `__auto_type` 来做类型推导。

```c
// File.c
__auto_type str = "string";
```

那么同时兼容 C/C++ 并且加上 `const` 的版本就变成了如下的宏定义 (`__auto_type` 在 C++ 其实也能用，就是写起来太麻烦)。
 
```c
#ifdef __cplusplus
    #define type auto
    #define const_type const auto
#else
    #define type __auto_type
    #define const_type const __auto_type
#endif
```

再把它变得有 Swift 的味道点。

```c
#ifdef __cplusplus
    #define var auto
    #define let const auto
#else
    #define var __auto_type
    #define let const __auto_type
#endif
```

于是乎我们就能像 Swift 一样写 ObjC/C++。

```objc
var vector = std::vector<NSInteger>{1, 2, 3};
let array = NSArray.alloc.init;
let block = ^void (id self, SEL _cmd) {
    return;
};
```

### Conditional Binding

在 Swift 中我们可以用 if let、guard let、where let 等来做到 `Conditional Binding`。

```swift
if let parent = NSViewController().parent {
    // ...
}
```

在 C++ 中我们也可以做到。

```cpp
if (let cgImage = UIImage.alloc.init.CGImage) {
    // ...
} else {
    // ...
}

if (let image = UIImage.alloc.init; let cgImage = image.CGImage) {
    // ...   
}
```

### Lightweight Generics

Swift 中的 `Generic Type`

```swift
public struct Array<Element> : RandomAccessCollection, MutableCollection {
    // ...
}
```

虽然 C++ 有 `template`，但它无法约束于 Cocoa Class，好在 Clang 为 ObjC 引入了 `Lightweight Generics` 使得我们可以获取到容器类的元素类型，使得我们可以做到如下代码所示的效果。

```objc
// typeof(array) = NSArray<NSString *> *const
let array = [NSArray<NSString *> new];
```

此外 Built-in 容器的方法诸如 `NSArray.copy`、`NSArray.mutableCopy` 对泛型不够友好，于是我们可以自己声明一个带有范型的版本。

``` objc
@interface NSArray<T>()

- (NSArray<T> *)copy __attribute__((objc_requires_super));

- (NSArray<T> *)mutableCopy __attribute__((objc_requires_super));

@end
```

### defer

`defer` 极大的改变了资源的获取与释放的代码编写流程，没有 `defer` 的情况下，我们需要在所有的退出语句都加上收尾处理。

```swift
func foo() {
    guard let list = class_copyMethodList(value, &outCount) else {
        return
    }
    if (condition) {
        // ...
        free(list)
        return
    }
    // ...
    free(list)  
}
```

用了 `defer` 之后我们就可以不用过于纠结的资源的释放，把精力放在 `Control Flow` 上，同时 Swift 也是一门提倡尽早 `return` 的语言。

```swift
// with defer
func foo() {
    guard let list = class_copyMethodList(value, &outCount) else {
    return
    }
    defer {
        free(list)
    }
    if (condition) {
        // ...
        return
    }
    // ...
    return 
}
```

在 C 中，得益于 Clang 的 c block、和 `__attribute((cleanup()))`，我们可以自己造一个 `defer`。

```objc
typedef void (^defer_block_t)(void);

_Pragma("clang diagnostic push")
_Pragma("clang diagnostic ignored \"-Wunused-function\"")
static inline void cleanup(__strong defer_block_t *block) {
    (*block)();
}
_Pragma("clang diagnostic pop")

#define defer_block($TOKEN) \
    __defer_block_ ## $TOKEN ## __
    
#define defer_block_at_line($LINE)  \
    defer_block($LINE)

#define defer   \
    __strong defer_block_t defer_block_at_line(__LINE__)    \
        __attribute__((cleanup(cleanup), unused)) = ^
```

通过这个宏定义和 Clang `__attribute__` 的赋能，我么就可以做到如下的 `Control Flow`。

```c
static pthread_mutex_t lock_key;

void foo() {
    pthread_mutex_lock(&lock_key);
    defer {
        pthread_mutex_unlock(&lock_key);
    };
    var cls_count = (unsigned)0;
    let cls_list = objc_copyClassList(&cls_count);
    defer {
        free(cls_list);
    };
    // do sth
}
```

### Default Protocol Implementations

在 Swift Protocol 的默认实现差不多是如下形式。

```swift
protocol Foo {
    
    associatedtype Element
    
    func method(_ arg: Element)
}

extension Foo where Element: Equatable {

    func method(_ arg: Element) {    
    }
    
    static func isEqual(_ lhs: Element, _ rhs: Element) -> Bool {
        return lhs == rhs
    }
}
```

对于 ObjC 来说还做不到这么强的泛型约束，但是单纯的 `Protocol` 默认实现我们可以通过 ObjC runtime 配合 C Marco，在 `dyld load` 之后 `Clang Module init` 之前向 dummy class 注入 `Protocol` 的默认实现，然后在 `Class +load` 的时候把这些默认实现的 `Method` 添加到具体的 `Class` 里，以达到同样的，比如给 UICollectionViewDelegate 加上不能重复选择的默认实现，会是下面这样的形式。

```objc
@extension(UICollectionViewDelegate)

- (BOOL)collectionView:(UICollectionView *)collectionView shouldSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    return false
}

@end
```

完整的实现参考 [GitHub](https://github.com/0xxd0/Cocoa.Swift/blob/master/CocoaSwift/Public%20Headers/Extension)。

### typealias

在 Swift 中有这样一段很典型的声明 ⬇

```swift
#if os(macOS)
import AppKit
typealias View = NSView
#elseif os(iOS)
import UIKit
typealias View = UIView
#endif
```

那么在 ObjC，通过 `@compatibility_alias` 中我们同样能做到这样的声明，而不是采用 C Marco 的形式。

```objc
#if TARGET_OS_IPHONE
#import <UIKit/UIView.h>
@compatibility_alias View UIView;

#elif TARGET_OS_MAC
#import <AppKit/NSView.h>
@compatibility_alias View NSView;

#endif
```

### Operator overload

借助 C++，我们同样能在 ObjC 中实现操作符重载。

```objc
CGSize operator*=(const CGSize &lhs, CGFloat multi) {
    return (CGSize){lhs.width * multi, lhs.height * multi};
}

let size = CGSizeMake(10, 10) *= 10;
```

### Function polymorphism

一个典型的 Swift 泛型函数。

```swift
public func max<T>(_ x: T, _ y: T) -> T where T : Comparable
```

借助 `template`，我们同样可以在 ObjC++ 达到同样的效果 ⬇

```objc
template <typename T>
T max(T x, T y) {
    return x < y ? y : x;
}

let maxInt = max(1, 2);
let maxDouble = max(1.0, 2.0);
```

## 最后

以上列举的特性，极大的提高了编码效率、可读性与安全性，虽然目前 Swift 在苹果的推动下气势越来越猛、野心也越来越大，未来越来越多的语言特性、更完备的 `stdlib` 以及更加稳定的 ABI 成为了苹果当下的主要目标。但是，包括苹果自己的框架在内，仍然有许多 App，以及一些优秀的开源库仍然无法从 ObjC/C++ 剥离。此外以上有相当一部分的特性我最早是在 [libextobjc](https://github.com/jspahrsummers/libextobjc) 中看到的，并且我认为有一些特性是可以作为语言的标准特性加入到 ObjC 的，这一切都得看苹果的心情。然而我觉得苹果也不是不可能良心发现给 ObjC release 个 3.0，毕竟苹果和 G 胖还是不一样的🤔。


## 进一步了解

1. [__auto_type does not inherit nullability to inferred type](https://openradar.appspot.com/27062504)
2. [if statement](http://en.cppreference.com/w/cpp/language/if)
3. [Adopting Modern Objective-C](https://developer.apple.com/library/content/releasenotes/ObjectiveC/ModernizationObjC/AdoptingModernObjective-C/AdoptingModernObjective-C.html)
4. [ObjCCompatibleAliasDecl](http://clang.llvm.org/doxygen/classclang_1_1ObjCCompatibleAliasDecl.html)
5. [8.6 compatibility_alias](https://gcc.gnu.org/onlinedocs/gcc/compatibility_005falias.html)
6. [auto-type.c](https://github.com/llvm-mirror/clang/blob/master/test/Sema/auto-type.c)
7. [Referring to a Type with typeof](https://gcc.gnu.org/onlinedocs/gcc/Typeof.html)
<!-- 8. https://pspdfkit.com/blog/2016/swifty-objective-c/
9. https://pspdfkit.com/blog/2017/even-swiftier-objective-c/ -->
