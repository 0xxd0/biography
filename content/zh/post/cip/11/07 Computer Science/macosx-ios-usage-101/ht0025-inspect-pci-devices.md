---
title: HT0025 如何在 macOS 上检视 PCI 设备

linktitle: HT0025 如何在 macOS 上检视 PCI 设备

type: book

date: 2018-12-27T10:31:29Z

draft: false

authors:
- admin

tags:
- macOS

categories:
- Computer Science 
- OS. Operating Systems
- macOS

weight: 0025
---

通过 [PCI Utilities](mj.ucw.cz/sw/pciutils/) 可以获取到 Mac 操作系统下所有 [PCI](https://en.wikipedia.org/wiki/Conventional_PCI) 设备信息。

以下高级步骤主要适用于系统管理员以及熟悉命令行的其他人员。

## 在“终端中”使用 `lspci` 命令

`lspci` 需要用到 `AppleACPIPlatformExpert`，需要在内核调试模式下才可运行

1. 安装 [PCI Utilities](https://github.com/pciutils/pciutils)。
2. 进入 macOS 恢复模式，进入“实用工具”菜单中的“终端”。如果当前 macOS 开启了 [SIP](https://en.wikipedia.org/wiki/System_Integrity_Protection) (e.g. El Capitan, Sierra)，请在终端中键入或粘贴以下命令以关闭 SIP。

```bash
csrutil disable
```

3. 在“终端“键入或粘贴以下命令。通过 nvram  命令以 Verbose Mode 启动操作系统，同时打开内核调试特性。

```bash
nvram boot-args="-v debug=0x144”
```

4. 完成后，请退出“终端”，并重启系统。
5. 重启完进入系统后，此时 `lspci` 即可使用。

## 使用 `lspci` 获取 PCI 设备信息

1. 在“终端”键入或粘贴以下命令。

```bash
sudo /usr/local/sbin/lspci -tv
```

2. 根据提示键入您的管理员密码，然后再次按下 Return 键。在您键入密码时，“终端”不显示任何字符。
3. 以 [MacBookPro12,1](https://support.apple.com/en-us/HT201300) 为例，可以看到所有 PCI 设备列表。

```bash
-[0000:00]-+-00.0  Intel Corporation Broadwell-U Host Bridge -OPI
            +-02.0  Intel Corporation Iris Graphics 6100
            +-03.0  Intel Corporation Broadwell-U Audio Controller
            +-14.0  Intel Corporation Wildcat Point-LP USB xHCI Controller
            +-15.0  Intel Corporation Wildcat Point-LP Serial IO DMA Controller
            +-15.4  Intel Corporation Wildcat Point-LP Serial IO GSPI Controller #1
            +-16.0  Intel Corporation Wildcat Point-LP MEI Controller #1
            +-1b.0  Intel Corporation Wildcat Point-LP High Definition Audio Controller
            +-1c.0-[01]--
            +-1c.1-[02]--
            +-1c.2-[03]----00.0  Broadcom Limited BCM43602 802.11ac Wireless LAN SoC
            +-1c.4-[05-ff]--
            +-1c.5-[04]----00.0  Samsung Electronics Co Ltd Device a801
            +-1f.0  Intel Corporation Wildcat Point-LP LPC Controller
            +-1f.3  Intel Corporation Wildcat Point-LP SMBus Controller
            \-1f.6  Intel Corporation Wildcat Point-LP Thermal Management Controller
```

4. 在“终端”键入或粘贴以下命令，可以获取到网卡信息。

```bash
sudo /usr/local/sbin/lspci | grep Network
03:00.0 Network controller: Broadcom Limited BCM43602 802.11ac Wireless LAN SoC (rev 01)
```

5. 对于关闭了 SIP 的情况下，出于安全考虑，有必要在完成以上必要步骤后再次开启 SIP，进入恢复模式，在“终端”键入以下命令。

```bash
csrutil enable
```

## 进一步了解

要进一步了解 `lspci` 命令，在终端中输入 `sudo /usr/local/sbin/lspci -h` 或者查阅 PCI Utilities [项目主页](mj.ucw.cz/sw/pciutils/)。