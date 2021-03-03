---
title: OE-0003 Protocol Default Implementation
linktitle: OE-0003 protocol default impl
type: book
date: 2016-06-26T10:31:29.000Z
draft: false
cip_code: '11.0701'
weight: 3
cips:
- 11.07) Computer Science
- 11.0701) Computer Science
---

<!-- # 引入 var, let 关键字 -->

* Proposal: [OE-0003](https://github.com/0xxd0/objc-evolution/blob/master/proposal/0003-protocol-default-implementation.md)
* Authors: [Xudong Xu](https://github.com/0xxd0)
* Status: **Implemented**


## Introduction

Swift 中，定义 Protocol 时，可以使用 extension 给某些方法提供默认实现，希望把此特性引入 Objective-C

## Motivation

在 Swift 中 Protocol 的默认实现一般为如下形式：

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

对 Objective-C 来说还做不到这么强的泛型约束，但是希望能够做到基本的 Protocol 默认实现，比如给 UICollectionViewDelegate 加上不能选择的默认实现：

```objc
@extension(UICollectionViewDelegate)

- (BOOL)collectionView:(UICollectionView *)collectionView shouldSelectItemAtIndexPath:(NSIndexPath *)indexPath {
    return false
}

@end
```

## Proposed solution

通过 ObjC runtime 配合 C Marco，在 `dyld load` 之后 `Clang Module Init` 之前向 Dummy Class 注入 Protocol 的默认实现。在 `Class +load` 时候把默认实现的 `Method` 添加到具体的 `Class` 里。


## Detailed design

实现参考

- [runtime/Extension.h#L20](https://github.com/0xxd0/objc-evolution/blob/75e73c073dab38d3f464b4bc12dc317b4a247ff1/runtime/Extension.h#L20)
- [runtime/Extension.cpp#L17](https://github.com/0xxd0/objc-evolution/blob/75e73c073dab38d3f464b4bc12dc317b4a247ff1/runtime/Extension.cpp#L17)

## Source compatibility

此特性是附加特性，并且不会破坏任何现有代码，只会精简先前繁琐的语法，不会有任何更改格式正确的代码的行为。 


## Alternatives considered

在 C++ 的环境下，可以通过 `auto` 完成类型推导：

```objc
auto array = [[NSMutableArray<NSString *> array];
```

但是这样会引入 C++，对于很多场景下这是没必要的。
