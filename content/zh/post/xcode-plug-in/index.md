---
title: Xcode 插件整理
subtitle: Xcode 插件整理

# Summary for listings and search engines
summary: Xcode 插件整理

# Link this post with a project
projects: []

# Date published
date: 2015-01-03T00:00:01Z

# Date updated
lastmod: 2015-01-03T00:00:01Z

# Is this an unpublished draft?
draft: false

# Show this page in the Featured widget?
featured: false

# Featured image
# Place an image named `featured.jpg/png` in this page's folder and customize its options here.
image:
  caption: 'Alcatraz, The package manager for Xcode.'
  focal_point: "Smart"
  placement: 1
  preview_only: false

authors:
- admin

tags:
- Xcode Plug-in

categories:
- Computer Science 
- PBD. Platform-Based Development
- Apple Platform
---

`deprecated` ⚠️ Xocde Plug-in 已退出历史的舞台

***

## Xcode 插件备忘清单

### [Alcatraz](https://github.com/alcatraz/Alcatraz)
 
用于搜索、安装、管理 Xcode 插件的插件，持项目模版和 Xcode 字体主题，省去了手动 Clone 再编译的过程。


### [BBUDebuggerTuckAway](https://github.com/neonichu/BBUDebuggerTuckAway)

当编辑代码的时候，能自动隐藏 `Debugger`，尤其适用于边调试边修改的情况。


### [ClangFormat-Xcode](https://github.com/travisjeffery/ClangFormat-Xcode)

使用 `ClangFormat` 来格式化代码风格，支持 LLVM，Google，Chromium，Mozilla，WebKit，或者自定义设置，代码洁癖必备之一。使用自定义格式时 `ClangFormat` 会从当前正在输入的文件的最近一级的父目录依次向上查找，直到找到用于确定代码风格的 `.clang-format` 文件，因此通常放在工程文件根目录即可，文件内容使用 YAML 格式，具体风格配置可以参考 [Clang-Format Style Options](http://clang.llvm.org/docs/ClangFormatStyleOptions.html) ，或者 [clangformat.com](http://clangformat.com)。


### [cocoapods-xcode-plugin](https://github.com/kattrali/cocoapods-xcode-plugin)

CocoaPods 的 Xcode 插件，省去命令行的步骤，直接在 Xcode 中对 CocoaPods 进行管理。


### [ColorSense-for-Xcode](https://github.com/omz/ColorSense-for-Xcode)

高效插件，可视化的 `UIColor/NSColor`。


### [FuzzyAutocompletePlugin](https://github.com/FuzzyAutocomplete/FuzzyAutocompletePlugin)

模糊匹配输入，比 Xcode 的前缀匹配要（能）方（偷）便（懒）许多，`hook` 了 Xcode 自带的 `IDEOpenQuicklyPattern`。

###### ⚠️ 在 Xcode 8 被自带的模糊匹配给干掉了


### [HOStringSense-for-Xcode](https://github.com/holtwick/HOStringSense-for-Xcode)

在 `ColorSense-for-Xcode` 基础上进行的修改，可视化编辑多种文本，正则表达式、多行文本、内联 `HTML` 等等。


### [KSImageNamed-Xcode](https://github.com/ksuther/KSImageNamed-Xcode)

使用 NSImage/UIImage imageNamed: 方法时，会给出所有工程文件中可选图片，并提图片预览。


### [SCXcodeMiniMap](https://github.com/stefanceriu/SCXcodeMiniMap)

为 Xcode 编辑器增加了一个 MiniMap，不过会挡住报错提示以及较长的的代码的末端，同时支持各种语法高亮。


### [SCXcodeSwitchExpander](https://github.com/stefanceriu/SCXcodeSwitchExpander)

与 `SCXcodeMiniMap` 为同一作者，为 swith 语句自动补全所有的 case，只能适用于枚举类型。


### [VVDocumenter-Xcode](https://github.com/onevcat/VVDocumenter-Xcode)

输入 `///` 即可生成一个简易文档模版。

###### ⚠️ 在 Xcode 8 已被苹果集成


### [XAlign](https://github.com/qfish/XAlign)

用于对齐代码，可以根据 =、Marco、Property 进行对齐，强迫症和代码洁癖必备


#### [XcodeColors](https://github.com/robbiehanson/XcodeColors)

更改 NSLog 在 console 中输出的颜色，CocoaLumberjack 的依赖项


### [XToDo](https://github.com/trawor/XToDo)

允许使用 `TODO`，`FIXME`，`???`，`!!!` 这些符号来标记需要完成的工作，汇总显示。


### [XVim](https://github.com/XVimProject/XVim)

让熟悉使用 `vim` 的开发者在 Xcode 中也能够有完整的 Vim 体验。