---
title: The Objective-C Programming Language Evolution

linkTitle: HomePage

# Date published
date: 2016-06-25T10:31:29Z
# Date updated
lastmod: 2016-06-25T11:31:29Z

# Is this an unpublished draft?
draft: false

type: book

# layout: docs

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
- PL. Programming Languages
- The Objective-C Programming Language
- The Swift Programming Language

cips: 
- 11.07 Computer Science 
- 11.0701 Computer Science
---

![build](https://github.com/0xxd0/objc-evolution/workflows/build/badge.svg?branch=master)

> That day, if swift had never been released..., would Objective-C be different?

The `objc-evolutions` repository maintains personal major proposals for exploration and enhancements to the The Objective-C Programming Language.


{{< ls_children show_summary="false" >}} 


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
public struct Array<Element> : RandomAccessCollection, MutableCollection {
    // ...
}
```

虽然 C++ 有 `template`，但它无法约束于 Cocoa Class，好在 Clang 为 ObjC 引入了 `Lightweight Generics` 使得我们可以获取到容器类的元素类型，使得我们可以做到如下代码所示的效果。

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

### typealias

在 Swift 中有这样一段很常见的声明：

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

借助 `template`，我们同样可以在 ObjC++ 达到同样的效果。

```objc
template <typename T>
T max(T x, T y) {
    return x < y ? y : x;
}

let maxInt = max(1, 2);
let maxDouble = max(1.0, 2.0);
```

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
