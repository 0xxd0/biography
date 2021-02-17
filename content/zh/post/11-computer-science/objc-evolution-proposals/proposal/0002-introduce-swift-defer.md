---
title: OE-0002 Introduce Swift defer keyword

linktitle: OE-0002 defer keyword

type: book

date: 2016-06-26T10:31:29Z

draft: false

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
weight: 2
---

* Proposal: [OE-0002](https://github.com/0xxd0/objc-evolution/blob/master/proposal/0002-introduce-swift-defer.md)
* Authors: [Xudong Xu](https://github.com/0xxd0)
* Status: **Implemented**

## Introduction

`defer` 是 Swift 定义变量的重要关键字，用于 Control Flow 在当前作用域退出之后的收尾操作，将 `defer` 关键字引入 Objective-C，使 Control Flow 更优雅。 

## Motivation

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

用了 `defer` 之后可以把精力放在 Control Flow 上，而不是在何处处理收尾，Swift 是一门提倡尽早 `return` 的语言：

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

## Proposed solution

得益于 Clang 的 `__attribute((cleanup()))` 特性，将 C Block 标记为一个从当前作用域退出之后执行的收尾用匿名函数。

## Detailed design

实现参考

- [runtime/swift.h#L29](https://github.com/0xxd0/objc-evolution/blob/75e73c073dab38d3f464b4bc12dc317b4a247ff1/runtime/swift.h#L29)

通过宏定义的 defer，可以做到如下的 Control Flow：

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

## Source compatibility

此特性是附加特性，并且不会破坏任何现有代码，只会精简先前繁琐的 Control Flow，不会有任何更改格式正确的代码的行为。 

## Alternatives considered

无