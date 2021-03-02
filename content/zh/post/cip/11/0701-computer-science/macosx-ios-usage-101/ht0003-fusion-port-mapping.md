---
title: HT0003 如何在 VMware Fusion 上进行端口映射

linktitle: HT0003 如何在 VMware Fusion 上进行端口映射

type: book

date: 2018-11-21T10:31:29Z

draft: false

authors:
- admin

tags:
- macOS

categories:
- OS. Operating Systems
- macOS

cips: 
- 11.07 Computer Science 
- 11.0701 Computer Science

weight: 0003
---

您可以通过编辑 VMware Fusion 的 NAT 配置文件来对端口进行映射。

以下高级步骤主要适用于系统管理员以及熟悉命令行的其他人员。

## 修改配置文件

1. 打开“应用程序”文件夹内“实用工具”文件夹中的“终端”。
2. 在获取管理员权限之后，通过 vim 或者手动编辑位于 /Library/Preferences/VMware Fusion.app/vmnet8/nat.conf 的 NAT 配置文件，在“终端”中键入或粘贴以下命令。

```bash
sudo vim /Library/Preferences/VMware\ Fusion.app/vmnet8/nat.conf
```

3. 自定义 incomingtcp 下的端口号（左侧）与虚拟机的端口号（右侧）进行流量转发。

```bash
[incomingtcp]
# Use these with care - anyone can enter into your VM through these...
# The format and example are as follows:
# <external port number> = <VM's IP address>:<VM's port number>
# 8080 = 172.16.3.128:80
```

## 重启 VMware Network

1. 打开“应用程序”文件夹内“实用工具”文件夹中的“终端”。
2. 在获取管理员权限之后，在“终端”中键入或粘贴以下命令。

```bash
sudo /Applications/VMware\ Fusion.app/Contents/Library/vmnet-cli --stop
sudo /Applications/VMware\ Fusion.app/Contents/Library/vmnet-cli --start
```

## 进一步了解

1. 如果需要进一步了解 Fusion 的 NAT 配置，您可以参考 [Advanced NAT Configuration](https://www.vmware.com/support/ws3/doc/ws32_network21.html)。