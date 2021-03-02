---
title: HT0022 如何创建可引导的 macOS 安装镜像

linktitle: HT0022 如何创建可引导的 macOS 安装镜像

type: book

date: 2018-11-09T10:31:29Z

draft: false

authors:
- admin

tags:
- macOS

categories:
- Computer Science 
- OS. Operating Systems
- macOS

weight: 0022
---

您可以将磁盘镜像用作安装 Mac 操作系统的启动磁盘。

以下高级步骤主要适用于系统管理员以及熟悉命令行的其他人员。[升级 macOS](https://support.apple.com/zh-cn/HT201475) 或[重新安装 macOS](https://support.apple.com/zh-cn/HT204904) 不需要安装器，但如果您在多台电脑上安装 macOS 时，可引导安装器就会很有用。

## 创建可引导安装器需要满足的条件

- 备用宗卷（格式化为 Mac OS 扩展格式），至少有 13 GB 可用储存空间
- 已下载 macOS Big Sur、Catalina、Mojave、High Sierra 或 El Capitan 的安装器

## 下载 macOS

- 下载：[macOS Big Sur](https://itunes.apple.com/cn/app/macos-big-sur/id1526878132?ls=1&mt=12)、[macOS Catalina](https://itunes.apple.com/cn/app/macos-catalina/id1466841314?ls=1&mt=12)、[macOS Mojave](https://itunes.apple.com/cn/app/macos-mojave/id1398502828?ls=1&mt=12) 或 [macOS High Sierra](https://itunes.apple.com/cn/app/macos-high-sierra/id1246284741?ls=1&mt=12)
  这些内容将作为名为“安装 macOS [版本名称]”的 App 下载到您的“应用程序”文件夹。如果安装器在下载后打开，请退出而不要继续安装。要获取正确的安装器，请从运行 [macOS Sierra 10.12.5 或更高版本](https://support.apple.com/zh-cn/HT201260)或者 El Capitan 10.11.6 的 Mac 中进行下载。如果您是企业管理员，请通过 Apple 下载，而不要通过本地托管的软件更新服务器进行下载。 

- 下载：[OS X El Capitan](updates-http.cdn-apple.com/2019/cert/061-41424-20191024-218af9ec-cf50-4516-9011-228c78eda3d2/InstallMacOSX.dmg)
  这个内容将作为名为“InstallMacOSX.dmg”的磁盘映像下载。在与 El Capitan 兼容的 Mac 上，打开下载的磁盘映像，并运行其中名为 InstallMacOSX.pkg 的安装器。它会在您的“应用程序”文件夹中安装一个名为“安装 OS X El Capitan”的 App。您将通过这个 App（而不是磁盘映像或 .pkg 安装器）创建可引导安装器。

## 在“终端”中使用 “hdiutil” 命令

1. 打开“应用程序”文件夹内“实用工具”文件夹中的“终端”。
2. 在“终端”中键入或粘贴以下命令，按下 Return 键以输入命令，创建安装镜像。

```bash
hdiutil create -o ~/Desktop/MyVolume -size 8g -layout SPUD -fs HFS+J && \
hdiutil attach ~/Desktop/MyVolume.dmg -noverify -mountpoint /Volumes/Install\ macOS\ Beta
```

## 在“终端”中使用 “createinstallmedia” 命令

1. 打开“应用程序”文件夹内“实用工具”文件夹中的“终端”。
2. 在“终端”中键入或粘贴以下命令。

```bash
sudo /Applications/Install\ macOS\ Beta.app/Contents/Resources/createinstallmedia —volume /Volumes/MyVolume.dmg --nointeraction
```

键入命令后：

1. 按下 Return 键以输入这个命令。
2. 出现提示时，请键入您的管理员密码，然后再次按下 Return 键。在您键入密码时，“终端”不会显示任何字符。
3. 出现提示时，请键入 Y 以确认您要抹掉宗卷，然后按下 Return 键。创建可引导安装器过程中，“终端”将显示进度。 
4. 当“终端”提示操作已完成时，宗卷的名称将与您下载的安装器名称相同，例如“Install macOS Catalina”。您现在可以退出“终端”并弹出宗卷。

{{< figure src="https://support.apple.com/library/content/dam/edam/applecare/images/en_US/macos/Big-Sur/macos-big-sur-terminal-create-bootable-installer.jpg" >}}

## 创建 .iso 镜像文件 

1. 打开“应用程序”文件夹内“实用工具”文件夹中的“终端”。
2. 在“终端”中键入或粘贴以下命令。

```bash
hdiutil convert ~/Desktop/MyVolume.dmg -format UDTO -o ~/Desktop/MyVolume.cdr
mv ~/Desktop/MyVolume.cdr ~/Desktop/MyVolume.iso
```

## 使用可引导安装镜像

创建可引导安装镜像后，在支持从磁盘镜像启动的操作系统上，请按照以下步骤进行使用：

1. 将可引导安装器作为硬件系统的虚拟磁盘。
2. 将系统开机或重新启动后，进入磁盘引导。
3. 根据提示选取您的语言。
4. 从“实用工具”窗口中选择“安装 macOS”（或“安装 OS X”），然后点按“继续”，并按照屏幕上的说明进行操作。

## 进一步了解

- 参考 [如何创建可引导的 macOS 安装器 - Apple 支持](https://support.apple.com/zh-cn/HT201372) 制作 USB 启动安装器
- 参考 [如何升级至 macOS Big Sur - Apple 支持](https://support.apple.com/zh-cn/HT201475) 获取 Big Sur 安装镜像。