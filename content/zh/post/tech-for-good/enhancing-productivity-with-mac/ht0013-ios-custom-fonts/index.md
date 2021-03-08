---
title: HT0013 如何向 iOS 系统中添加自定义字体
linktitle: HT0013 如何向 iOS 系统中添加自定义字体
type: book
date: 2018-12-10T10:31:29.000Z
draft: false
authors:
- admin
tags:
- iOS
cip_code: '11.0701'
categories:
- OS. Operation System
- iOS
cips:
- 11.07) Computer Science
- 11.0701) Computer Science
weight: 13
---

为 iPhoneOS / iPadOS 设备添加自定义字体。

以下高级步骤主要适用于系统管理员以及熟悉命令行的其他人员。

## 概览

iOS 并不限制第三方添加字体到系统之中，当你有自定义字体想在你的 app 或者其他系统内建应用（e.g. Notes.app, Pages.app）中使用时，通过 iOS 提供的多种方法你可以实现不同的结果。

## 为应用添加自定义字体

为一个 app 添加字体，字体的使用范围限制于当前 app 之中，如图所示，将字体拖入至工程，并勾选对应的 Target Membership。

{{< figure src="https://docs-assets.developer.apple.com/published/35bc80c902/d373ed5c-a36b-46fe-9bd8-bf49700072be.png" title="Adding a Custom Font to Your App" >}}

通过 Info.plist **UIAppFonts** (Fonts provided by application) 字段向 Xcode 工程注册字体，完成之后就可以像其他 iOS 内建字体一样使用你的自定义字体。

更多请参考 Apple 文档 [Adding a Custom Font to Your App | Apple Developer Documentation](https://developer.apple.com/documentation/uikit/text_display_and_fonts/adding_a_custom_font_to_your_app)。

## 向 iOS 系统注册自定义字体

为系统内建的应用提供自定字体需要用到 iOS 13 新提供的 CoreText 的 API，同时需要在 App.entitlements 中添加 Fonts Capability 并勾选 Install Fonts，使用字体时需要勾选 Use Installed Fonts。

{{< figure src="CTFontManagerRegisterFontURLS.png" title="WWDC19 Session 227" >}}

{{< figure src="https://docs-assets.developer.apple.com/published/1b7e45d9c2/f9329213-4abb-413e-a339-4b91ee4bf554.png" title="Adding a Custom Font to Your App" >}}

如果其他 app 需要使用通过 CTFontManagerRegisterFontURLS  进行注册的字体，需要通过 CTFontManagerRequestFonts 进行 request 才能获得字体。

{{< figure src="CTFontManager.png" title="WWDC19 Session 227" >}}

更多请参考 [Font Management and Text Scaling - WWDC 2019 - Videos - Apple Developer](https://developer.apple.com/videos/play/wwdc2019/227/)。

## 通过 .mobileconfig 向 iOS 系统添加自定义字体

通过 CoreText 提供的 API 有需要使用 CTFontManagerRequestFonts 的限制，所以无法适用于部分没有使用此 API 的 app (e.g. Notes.app)，因此可以通过 Apple Configurator 2 生成字体 Profile 来配置字体，打开 Apple Configurator 2 并切换到 Fonts 页面，点击右侧的 Configure，就会弹出对话框要求选择字体。
单个描述文件的容量上限约为 20 megabytes，所以对于较小西文字体文件，可以将整个 Font Family 配置到同一个描述文件中，对于较大的非西文字体，则应该逐个单独添加。

{{< figure src="apple-configurator-2.png" >}}

## 进一步了解

1. [Adding a Custom Font to Your App | Apple Developer Documentation](https://developer.apple.com/documentation/uikit/text_display_and_fonts/adding_a_custom_font_to_your_app)
2. [Font Management and Text Scaling - WWDC 2019 - Videos - Apple Developer](https://developer.apple.com/videos/play/wwdc2019/227/)
3. [iOS 13 Custom Fonts download and installation](https://stackoverflow.com/questions/57653398/ios-13-custom-fonts-download-and-installation)
4. [Browse Fonts - Google Fonts](https://fonts.google.com)
5. [Google Noto Fonts](https://www.google.cn/get/noto/)