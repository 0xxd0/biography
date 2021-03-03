---
title: OE-0001 Introduce Swift var, let keyword
linktitle: OE-0001 var & let keyword
type: book
date: 2016-06-26T10:31:29.000Z
draft: false
cip_code: '11.0701'
weight: 1
cips:
- 11.07) Computer Science
- 11.0701) Computer Science
---

<!-- # 引入 defer 关键字 -->

* Proposal: [OE-0001](https://github.com/0xxd0/objc-evolution/blob/master/proposal/0001-swift-var-and-let.md)
* Authors: [Xudong Xu](https://github.com/0xxd0)
* Status: **Implemented**


## Introduction

`var` 和 `let` 是 Swift 定义变量的重要关键字，描述了变量是否可以被修改，将这些关键字引入 Objective-C，以更好地表达变量的可变性。 


## Motivation

在 Objective-C 中变量声明的 Type Inference 一直没有很好的解决方案，下方的显示类型声明代码是我们经常需要面对的：

```objc
NSMutableArray<NSString *>* array = [[NSMutableArray<NSString *> array];
```

在 Swift 中会由类型推导自动完成：

```swift
var elements = [String]();
```


## Proposed solution

在 ObjC 中引入 `let` 和 `var` 关键字：

```objc
let elements = [NSMutableArray<NSString *> array];
```

影响范围为所有变量声明，并且同时兼容 C/C++。


## Detailed design

得益于 Clang 将类型推导特性带入了 pure C，使得我们能在 C 代码中使用 `__auto_type` 来做类型推导：

```c
// File.c
__auto_type str = "string";
```

以 `const` 修饰达到 `let` 的效果，通过宏实现定义关键字：

```c
#ifdef __cplusplus
    #define var auto
    #define let const auto
#else
    #define var __auto_type
    #define let const __auto_type
#endif
```

使 C/ObjC 能像 Swift 一样使用 `var` 和 `let`。

```objc
var vector = std::vector<NSInteger>{1, 2, 3};
let array = NSArray.alloc.init;
let block = ^void (id self, SEL _cmd) {
    return;
};
```


## Source compatibility

此特性是附加特性，并且不会破坏任何现有代码，只会精简先前繁琐的语法，不会有任何更改格式正确的代码的行为。 


## Alternatives considered

在 C++ 的环境下，可以通过 `auto` 完成类型推导：

```objc
auto array = [[NSMutableArray<NSString *> array];
```

但是这样会引入 C++，对于很多场景下这是没必要的。
