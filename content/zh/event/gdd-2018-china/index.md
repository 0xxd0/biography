---
title: Google Developer Days China 2018 参会记录
event: Google Developer Days China 2018
event_url: https://www.google.cn/intl/en/events/developerdays2018/
location: The Expo Center
address:
  street: ''
  city: Shanghai
  region: ''
  postcode: ''
  country: China
summary: 了解 Google 创新技术，与 Google 全球产品专家面对面，亲身体验 Google 产品
abstract: >-
  Google 开发者大会 (Google Developer Days，简称 GDD) 是展示 Google
  最新开发者产品和平台的全球盛会，旨在帮助你快速开发优质应用，发展和留住活跃用户群，充分利用各种工具获得更多收益。2018 Google 开发者大会将于 9
  月 20 日和 21
  日于上海举办，主题将涵盖机器学习、ARCore、Android、Play、WearOS、无障碍、移动网络、Firebase、Assistant、物联网、云服务、Flutter、广告、设计，等等。我们非常高兴与你分享我们关于创新技术的想法，鼓励广大开发者着手构建下一个精彩的移动应用或网络体验。
image:
  caption: Google Developer Days China 2018
  focal_point: Smart
  placement: 1
  preview_only: false
links:
- icon: google
  icon_pack: fab
  name: Agenda
  url: https://www.google.cn/intl/en/events/developerdays2018/agenda/
url_code: ''
url_pdf: ''
url_slides: ''
url_video: ''
slides: ''
projects: []
tags:
- Tensorflow
- Firebase
- Flutter
- ARCore
- GoogleIO
categories:
- Computer Science
- Developer Conference
date: '2018-09-20T09:00:00Z'
date_end: '2018-09-21T18:00:00Z'
all_day: true
publishDate: '2018-09-22T04:19:00Z'
lastmod: '2021-01-04T00:00:00Z'
draft: false
authors:
- admin
featured: false
reading_time: true
share: false
profile: true
commentable: false
editable: false
gallery_item:
- album: album-tensorflow
  image: anna-goldie.jpg
  caption: Google AI 妹子工程师上台对自家 TensorFlow 进行了一波带有东北腔的美式中文吹爆
- album: album-tensorflow
  image: opensource.jpg
  caption: 开源社区对于 TensorFlow 的贡献量，全球 1700 万的下载量中有 200 万来自中国用户贡献
- album: album-tensorflow
  image: tensorflow-china.jpg
  caption: 在中国正在使用 TensorFlow 的公司
- album: album-tensorflow
  image: lstm-networks.jpg
  caption: 中国海洋大学的科研人员借助 TensorFlow，通过使用 LSTM NetWorks 对 SST 进行可靠的预测，以达到分析全球气候状况的目的
- album: youtube-and-flutter
  image: youtube-and-flutter.jpg
  caption: Youtube and Flutter
- album: youtube-and-flutter
  image: flutter-booth.jpg
  caption: 带着蓝带子吊牌的老哥就是之后 Keynote 的主讲，一旁的 YouTube 展台异常冷清
- album: youtube-and-flutter
  image: flutter-demo.jpg
  caption: Flutter 展台 Demo 应用
- album: flutter
  image: rendering-performance.jpg
  caption: Flutter 渲染性能
- album: flutter
  image: flutter-android.jpg
  caption: Flutter 对比安卓渲染模式
- album: flutter
  image: fflutter-ios.jpg
  caption: Flutter 对比 iOS 渲染模式
- album: flutter
  image: flutter-render.jpg
  caption: Flutter 渲染模式
- album: flutter
  image: flutter-render-trees.jpg
  caption: Flutter 渲染树
- album: flutter-graphics
  image: what-is-flutter.jpg
  caption: Flutter 是什么
- album: flutter-graphics
  image: flutter-performance.jpg
  caption: Flutter 的性能
- album: flutter-graphics
  image: skia-engine.jpg
  caption: Skia 渲染引擎
---

## TensorFlow 亲儿子

TensorFlow 是本届 GDD 的重点照顾对象，在开幕演讲中一位 Googla AI 的产品经理对 Google AI 的应用落地场景进行了简单的介绍，同时推荐了自家今年三月份的上线的 [MLCC](https://developers.google.com/machine-learning/crash-course/)，旨在帮助广大爱好者快速无障碍入门 AI，在大幅降低门槛的前提下，使得每个人都能参与到其中。

{{< gallery album="album-tensorflow" >}}

同时一起宣布的还有 Google AI 中国中心会在北京以及上海举行机器学习应用冬令营，并且在可能的情况下会提供 Google AI 工程师的实习机会，将其更好的运用到实战。

紧接着开幕演讲，主会场在 11:00 召开了面向所有开发者的 TensorFlow 简介。

{{< figure src="introduce-to-tensorflow.jpg" title="Introduce to Tensorflow" >}}

会上介绍了什么是 TensorFlow、它是如何运作的、它该如何使用。介绍了 TensorFlow 这个平台如何更方便的帮助开发者构建要用于人工智能应用中的机器学习模型。

会上展示了一个 Fashion MNIST 的现场 Demo。

{{< figure src="fashion-mnist.jpg" title="Fashion MNIST" >}}

具体演示了如何利用 Keras 对 70000 个训练样本、10 个类别进行神经网络训练，包涵 Keras 一系列的：

1. [Sequential Model 的建立](https://keras.io/models/sequential/)
2. [loss 函数的配置](https://keras.io/losses)
3. [Optimizer 的选择](https://keras.io/optimizers/)
4. [Model 的训练方式](https://keras.io/getting-started/sequential-model-guide/#training)

大部分演示内容的要点都可以在 [Keras Documentation](https://keras.io) 中找到。

在 20 号当天下午还有一场《编写机器学习的7个步骤》Keynote 以及 21 号一整天的《TensorFlow 专场》传销大会。内容涵盖了：

- [Swift for TensorFlow](https://github.com/tensorflow/swift) 以及 [tensorflow.js](https://js.tensorflow.org)，Swift 版本的 TensorFlow 早在今年 4 月已经开源，笔者感到很欣慰，作为一个 Apple Developer 终于不用担心苹果倒闭后需要面临失业的问题
- TensorFlow Lite 允许 App 开发者压缩和优化 TensorFlow 模型，使之能在 Android、iOS 和各种物联网设备上运行，使得在未连接到云端的移动设备上运行智能应用变得可能
- TensorFlow 的 DistributionStrategy Class 使得将工作量分散到多个 GPU、多节点训练变得可能，为训练大型机器学习模型提供了实际的解决方案

不过由于时间关系上述的 Keynote 笔者都没能参与，还是非常可惜的。


## Flutter 的磅礴野心

[Flutter](https://flutter.io) 可以说是本届 GDD 上的焦点主题，在此次大会上 Google 公布了 Flutter Release Preview 2，距离 Flutter 正式 Release 也变得指日可待。 

{{< figure src="flutter-release-preview-2.jpg" title="Flutter Release Preview 2" >}}

在 20 日当天有关 Flutter 的 Keynote 一共被安排了 4 场，下午 4:45 开始的连续两场的内容关注点都在 Flutter 底层原理剖析以及 High Performance 上，因此笔者选择了去这两场。

笔者在等待 Keynote 开始的期间，去产品展示区溜达了一圈，溜着溜着就溜到了 Flutter 展台，只见 Flutter 的几个工程师一直被围在人群之中回答问题，周围围观的吃瓜开发者疯狂输出问题，场面异常劲爆。Flutter 展台也是为数不多的吃瓜群众把注意力全放在内容本身而不是礼品和贴纸上的展台了。笔者靠着精致的走位顺利插入展台前排。在实际体验之后发现 Flutter 在运行过程中，除了部分场景下（大部分是 ScrollView 的场景下）出现了不跟手的情况，大部分情况下都十分流畅，在和 Flutter 工程师交流后也得到了解答，无论是 iOS 和 Android 都是基于 Skia 的 API 进行渲染，并且 iOS 底层和安卓一样也是基于 OpenGL ES 实现的，关于 iOS Skia 是如何编译可以参考这篇[文档](https://skia.org/user/build)。

{{< gallery album="youtube-and-flutter" >}}

回到 Flutter 分会场，第一场 Flutter Keynote 的主题是《剖析你的 Flutter App》。整场 Keynote 围绕着什么是性能展开。通过横向对比双平台的 Render Architecture 异同，纵向对比 Native 与 JS 调用 Native API 的产生的不必要的性能损耗，最终引出 Flutter 渲染理念，更少的计算量带来更多的性能提升。

{{< gallery album="flutter" >}}

不过虽然听上去很美好，但是 Flutter 的性能表现实际上是与开发者的实现息息相关。Flutter 和大部分视图渲染架构一样也是通过遍历树去寻找渲染节点，存在节点遍历即存在性能损失，而这部分性能损失需要开发者手动去优化，官方在 Build 与 Paint 这两个 Phase 中结合现场演示给出了几条性能优化的实战建议：

如何提高 Build 效率？

- 尽量降低遍历的出发点
    - 通过标脏 `setState` 来实现 
    - 通过 `InheritedWidget` 来传递 `state`
    - 热重载

- 重用同一子组件实例
    - 能有效的做到在遍历至子组件时做到停止遍历

- 如何提高 `Paint` 效率？
    - 设置 `RepaintBoundary`，在整个绘制树产生一次重绘时，通过 `RepaintBoundary` 来阻断重绘的区域

因此性能优化的重任落到开发者的身上了，又是一项体力活。在整个演示过程中使用到了一部分 Profile 工具以及 Debug Flag 来监测 App 的 Performance，具体可以在 [Flutter Performance Profiling](https://flutter.io/ui-performance/) 以及 [Debugging Flutter Apps](https://flutter.io/debugging/) 找到。

到了第二场 Keynote 上来了个幽默的老哥，这场的主题是《深入介绍 Flutter Graphics 性能》。

{{< figure src="flutter-graphics-hero.jpg" title="深入介绍 Flutter Graphics 性能" >}}

在进行了一轮 Skia 牛逼吹爆后，进入正题，主要内容围绕着通过分析绘图指令来不断优化 App 的性能。Flutter 的渲染原理是将一个渲染帧录制成 SkPicture (skp) 提交给 Skia 进行渲染，利用这个特点，通过捕捉一帧 skp，配合 [Skia Debugger](https://debugger.skia.org)，可以精确分析到单个渲染帧中每一条绘图指令，整场 Keynote 大部分时间都花在现场演示优化，具体不在此赘述。

{{< gallery album="flutter-graphics" >}}

值得一提的是，在实际调试过程中，官方不推荐且极其不推荐使用 iOS 模拟器进行调试，理由是 Skia 在 iOS 模拟器使用 CPU 作为渲染后端，和真机的 GPU 后端会有较大的性能上的出入。


## Android 把路走宽了

随着业界毒瘤果的 iPhone X 开卖，国内各大安卓厂商也纷纷跟风推出刘海屏的机器，说实话笔者个人认为刘海屏这个设计真的很丑。面对这么一大波国产刘海屏手机，谷歌非但没置之不理，反而却十分接地气的在 Android 9 中添加了刘海屏的适配方案[显示屏缺口支持](https://developer.android.com/about/versions/pie/android-9.0)，颇有大厂风范。

在 Android 9 中利用 DeepMind 通过对 App 进行使用频率分组来尽可能降低 CPU 唤醒频率以达到延长电池的续航能力，官方称唤醒频率被有效的降低了 30%。

{{< figure src="android-battery.jpg" title="Android Battery" >}}

对于非 SDK 接口的调用在 Android 9 会被限制，具体可以参考[对非 SDK 接口的限制](https://developer.android.com/about/versions/pie/restrictions-non-sdk-interfaces)，旨在提高应用的稳定性。

{{< figure src="android-sdk-restrict.jpg" title="Android SDK Restrict" >}}

Google 在 2018 Google I/O 上发布了新的框架组件 JetPack，今次在 GDD 上再次拿出来发酵一下，大致如上图所示。其中的 Navigation 和 iOS 中的 Storyboard 有着异曲同工之妙。JetPack 包含了大量的简化开发的新框架，具体可以参考官方文档 [Android Jetpack](https://developer.android.google.cn/jetpack/)。

{{< figure src="android-jetpack.jpg" title="Android JetPack" >}}

Google 通过 [Android App Bundle](https://developer.android.google.cn/platform/technology/app-bundle/) 进行 apk 的动态分发，以提供 apk 的瘦身效果。在 iOS 中有类似的 [On Demand resource](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/On_Demand_Resources_Guide/Tagging.html)，但比起 Android App Bundle] 有着更多的局限性。

{{< figure src="android-app-bundle.jpg" title="Android APP Bundle" >}}

## 还有 WearOS、Firebase、ARCore

#### WearOS

WearOS 在这届 GDD 上更多的是商业上的介绍，广告以及产品上的介绍比较多，在开幕式上也花了一定的篇幅去介绍 WearOS 的合作伙伴以及品牌。与开发者相关的有《Wear OS 表盘开发入门》以及《Wear OS 应用开发入门》，由于时间有限没有前去与会。

{{< figure src="arcore.jpg" title="ARCore" >}}

#### ARCore

ARCore 也是本届 GDD 的焦点之一，ARCore 是 Google 的增强现实体验构建平台。 ARCore 利用不同的 API 让您的手机能够感知其环境、了解现实世界并与信息进行交互。今次 Google 一共安排了 2 场 Codelab 以及 4 场面向开发者的 Keynote 来帮助开发者更快更平滑的入门 ARCore 开发，非常遗憾的是笔者没有更多的时间去参与到其中。

#### Firebase

这次大会上重点介绍了下 Firebase 的 Realtime Database，看上去和 CloudKit 差不多，主要的重点还是之后的 ML Kit for Firebase。结合了 ML Kit 的 Firebase 在 TensorFlow Lite 助力下，App 可以动态加载训练模型而非直接打包在 App 中，从而达到模型热升级的目的，对中小型开发团队来说是相当有好的。

{{< figure src="mlkit.jpg" title="ML Kit" >}}


## 最后

总得来说，这次 GDD 还是收获不小，Google 给予了开发者对于未来技术的引导、解答以及分享。技术分享有深有浅，还有许多非开发相关、针对商业市场的 Keynote 可供选择。未来 TensorFlow 依然是 Google 的绝对重点，Android 的整个生态越发趋于完善与规范，Flutter 蓄势待发准备大一统。不过比较可惜的是今年没有 IoT 的开发版可以拿，期待明年的 GDD。

{{< figure src="end.jpg" title="終わり" >}}