---
title: HT0002 如何在 macOS 上显示隐藏文件和文件夹
linktitle: HT0002 如何在 macOS 上显示隐藏文件和文件夹
type: book
date: 2017-11-26T10:31:29.000Z
draft: false
authors:
- admin
tags:
- macOS
cip_code: '11.0701'
categories:
- OS. Operating Systems
- macOS
cips:
- 11.07) Computer Science
- 11.0701) Computer Science
weight: 2
---

您可以通过命令行来显示被 Mac 操作系统隐藏的文件和文件夹。

以下高级步骤主要适用于系统管理员以及熟悉命令行的其他人员。

## OS X Mavericks 及之后的 Mac 操作系统

1. 打开“应用程序”文件夹内“实用工具”文件夹中的“终端”，在“终端”中键入或粘贴以下命令。

```bash
defaults write com.apple.finder AppleShowAllFiles -boolean true ; killall Finder
```

2. 完成之后，你将会在 Finder 中看到被隐藏的文件和文件夹。
3. 如果希望再次一次这些被隐藏的文件和文件夹时，在“终端”中键入或粘贴以下命令。

```bash
defaults write com.apple.finder AppleShowAllFiles -boolean false ; killall Finder
```

**【提示】** 该命令适用于 OS X Mavericks 和 OS X Yosemite 系统。对于还在使用 OS X Mountain Lion 或是更早版本的系统的 Mac 用户来说，请使用如下的命令。

## OS X Mountain Lion 及之前的 Mac 操作系统

1. 打开“应用程序”文件夹内“实用工具”文件夹中的“终端”，在“终端”中键入或粘贴以下命令。

```bash
defaults write com.apple.finder AppleShowAllFiles TRUE ; killall Finder
```

2. 完成之后，你将会在 Finder 中看到被隐藏的文件和文件夹。
3. 如果希望再次一次这些被隐藏的文件和文件夹时，在“终端”中键入或粘贴以下命令。


## 进一步了解

1. [在 Mac 上显示或隐藏文件扩展名 - Apple 支持](https://support.apple.com/zh-cn/guide/mac-help/mchlp2304/mac)