---
title: Introduce Objective-C Evolution
subtitle: About The Objective-C Programming Language Evolution
summary: About The Objective-C Programming Language Evolution
date: 2016-06-25T10:31:29.000Z
lastmod: 2016-06-25T11:31:29.000Z
projects:
- project-objc-evolution
draft: false
cip_code: '11.0701'
featured: false
image:
  caption: Objective-C
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
- The Objective-C Programming Language
- The Swift Programming Language
cips:
- 11.07) Computer Science
- 11.0701) Computer Science
---

## 序

Swift 3.0 问世之际，随之而来的是 `API` 的清晰语意、更加完备的泛型、更 Swift Style 的 C APIs 等等。这也意味着 Swift 未来霸主地位越来越难被撼动。回看 Objective-C，作为一门 1980s 诞生的语言，在 Swift 的持续迭代下，ObjC 越发失去生机，`Type Inference` 的缺失、`Dynamic Dispatch` 的性能开销、不安全的 `runtime`，过度啰嗦的 API 设计，都使得其在各方面被 Swift 全面碾压，大概目前能谈得上优势的也只剩下强大的 `runtime` 动态性和 C/C++ 混编了。

今次回顾下 Objective-C，依稀能看出语言设计上的年代感，对于 Objective-C 来说，如果当初 Swift 没有出现的话，Objective-C 3.0 是否能如期问世？

{{< cta cta_text="View **The Objective-C Programming Language Evolution**" cta_link="../objc-evolution-proposals" cta_new_tab="true" >}}

## Objective-C Evolution

### 开端

尽管 Swift 的语法与性能以其压倒性的优势凌驾于 ObjC 之上，但缺点和短板的也很明显：

- 从 Swift 1.0 到 2.3 再到目前的 3.0，Swift 的飞速发展有目共睹，但与此同时其不稳定的 ABI 也一直被诟病，开发者们戏称道 Swift 1.0/2.0/3.0 是三门语言，虽然并没有那么夸张，但其对于代码的冲击性是确确实实的，对于小型团队来说 Swift 的版本迁移可能就几天就解决了，然而对大型项目来说，这个变化是毁灭性的。同时 Swift 持续迭代中产生的 `bug`、`issue` 并不能被很快的解决，那么势必我们会偶然间为 Swift 的发展而踩坑。通常来说，这些迁移所带来的额外成本在快速迭代的开发环境下是不被允许的。

- Swift 表现和 C++ 在很多地方都十分相似，非常 static，这也意味着 Swift 在动态性上非常薄弱，stdlib 中的 `Mirror` 相比于 ObjC 的 `runtime`，简直就是小巫见大巫，再者 `Foundation` 中的 `KVC`、`KVO` 在 Swift 中需要借助 `NSObject` 和 `dynamic` 来完成。

- 对于一些有历史包袱或者偏底层的框架来说，它们无法从 C/C++ 剥离，而对于 C++，Swift 则必须通过 C、ObjC 来作为桥梁，无形中增加了开发成本，同时 Swift 对于指针的支持特别是函数指针并不是那么的友好，虽然这也无可厚非，毕竟 Swift 强调 `safe`，指针本身就是 `unsafe` 的，但使用上总有那么些许的不流畅。

虽然目前的 Swift 依然有不少缺点，但作为一个积极的 Swift 布道者来说，其仍然是我目前为止评价最高的一门语言，其强大而优雅的语法特性、涵盖了多种模式的编码环境、内存管理哲学、以及针对性能所做的优化是目前的 Objective-C 望成莫及的。

{{% callout info %}} 了解更多 {{% /callout %}}

{{< cite page="swift-design-philosophy" view="4" >}} 


### 共生

事实上 Apple 为了让 Swift 和 Objective-C、Foundation 层面互相兼容，在 LLVM 上做了非常多的工作，同样在 Swift Native 层面也做了大量的 Cast 和 Bridge，以至于导致了好多 Bug，列举几个我遇到过的:

- NSError 的 `overrelease`，出现在 NSError 和 Error 互相 Cast 的场景，主要挂在 `tryDynamicCastNSErrorObjectToValue`，通过 Allocation 最终定位为 swift runtime 的 bug
    - [SR-9207](https://bugs.swift.org/browse/SR-9207)
    - [Crash while casting object in swift](https://stackoverflow.com/questions/62410980/crash-while-casting-object-in-swift)

引入 Swift 的代价是巨大的，但带来的收益同样也很可观，客观来说 Objective-C 的地位已然被撼动，试问一句还能战多久？


### 理想

Objective-C 最大优点在于非常动态，这同样也是其缺点。高度的动态性导致其类型的不安全，冗长的自描述语法导致编码时效率低下，和 C/C++ 高度兼容的多语言特性增加了编码方式的可能性，但也导致潜在要处理的编码场景变得更为复杂。

汲取现代语言的特性，展望 Objective-C 3.0 可拓展的特性： 

- 类似 `var` 和 `let` 关键字，参考 Swift，既满足了类型推导，又满足了可变性控制
- `guard` 和 `defer` 关键字，参考 Go 和 Swift  构建优雅 Control Flow 的必要元素
- `aysnc` 和 `await` 关键字和协程，参考 .NET
- 支持泛型和模版，目前的 Objective-C 仅支持轻量型泛型
- 以 `.` 语法代替 `[]`，事实上 Foundation 中大量的 `getter` 都在逐渐适配成 @property，`.` 语法的可用范围正在逐渐变多
- 参数的空指针自描述，参考 Swift，在 Swift 中由 Optional 完成，Objective-C 中有 `nullability` 关键字，不过主要服务于 Objective-C 到 Swift 的 API naming
- Protocol 的默认实现，参考 Swift
- Access Control

### Evolution

得益于 LLVM 以及出色的 Clang 前端，使得 Swift 以及一些现代语言的语法特性在 ObjC 中出现具有了可能性。拟参考 [apple/swift-evolution](https://github.com/apple/swift-evolution) 的形式，基于对 Objective-C 原生特性拓展研究以及衍生特性的挖掘目的，建立 The Objective-C Programming Language Evolution 作为 Objective-C 的 CodeLab。


### 结语

虽然目前 Swift 在苹果的推动下气势越来越猛、野心也越来越大，未来越来越多的语言特性、更完备的 `stdlib` 以及更加稳定的 ABI 成为了苹果当下的主要目标。但包括苹果自己的框架在内，以及仍然有许多应用、优秀的开源库无法从 Objective-C/C++ 剥离。个人认为一些优秀并且已经被开源社区实现的特性是可以作为语言的标准特性加入到 Objective-C 的，就看 Apple 有没有这个意愿发布 Objective-C 3.0，毕竟 Apple 和 **{{< icon name="steam" pack="fab" >}}G 胖**还是不一样的。


## 进一步了解

{{< cite page="objc-evolution-proposals" view="4" >}}