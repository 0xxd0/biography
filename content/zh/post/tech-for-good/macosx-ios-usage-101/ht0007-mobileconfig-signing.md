---
title: HT0007 如何使用 SSL 证书签名 iOS .mobileconfig 文件
linktitle: HT0007 如何使用 SSL 证书签名 iOS .mobileconfig 文件
type: book
date: 2018-12-09T10:31:29.000Z
draft: false
authors:
- admin
tags:
- iOS
cip_code: '11.0701'
categories:
- OS. Operating Systems
- iOS
cips:
- 11.07) Computer Science
- 11.0701) Computer Science
weight: 7
---

您可以使用证书与 OpenSSL 签名 iOS 平台 .mobileconfig 文件。

以下高级步骤主要适用于系统管理员以及熟悉命令行的其他人员。iPhoneOS / iPadOS 设备上的配置描述文件（.mobileconfig）是以 .plist 为载体，包含了设备安全策略、VPN 配置信息、Wi-Fi 设置、APN 设置、Exchange 帐户设置、Google 帐户设置、邮件设置以及允许 iPhone, iPod touch, iPad 与企业系统配合使用的证书。本文描述了开发者如何使用 SSL Certification 对 . mobileconfig 文件进行签名，以确保 iPhoneOS / iPadOS 系统上的安全性。

## 准备工作

### 理解证书的状态

| 状态 | 说明 |
|-|-|
| Unsigned | The mobileconfig is not signed by anyone. Therefore the source is unknown. |
| Unverified | The mobileconfig is signed, but the source is not recognized as trusted. |
| Verified | The mobileconfig is signed and is recognized as a trusted source. |

当使用 Apple Configurator 2 为 iPhoneOS / iPadOS 添加 Profile 文件时，未签名的 .mobileconfig 文件会被标记为 "Unsigned" 状态，修复此问题我们需要对 Profile 进行签名。

### 准备所需要的文件

1. 未签名的 .mobileconfig 文件，**UnsignedProfile.mobileconfig**
2. 证书对应 Private Key，**PrivateKey.pem**
3. 与 SSL 证书对应的证书链（中级证书），**CertChain.pem**
4. 受信任的 SSL 证书，自签名证书、TrustAsia, Let’s Encrypt 等签发的免费 SSL 证书，商业 SSL 证书，**Certificate.pem**

### 签名方式

```bash
openssl smime 
    -sign \
    -in UnsignedProfile.mobileconfig \
    -out SignedProfile.mobileconfig \
    -signer Certificate.pem \
    -inkey PrivateKey.pem \
    -certfile CertChain.pem \
    -outform der -nodetach
```

## 使用自签名证书签名

创建可引导安装器后，请按照以下步骤进行使用：

### 从 Keychain Access 导出自签名证书

Keychain Access -> Certificate Assistance -> Create a Certificate，根据提示创建证书，创建完成之后对证书私钥进行导出，右键证书点击 Export 导出 Certificate.per，右键私钥点击 Export 导出 PrivateKey.p12，通过命令行将 .p12 转换为 .pem，将 Certificate.per 转换为 Certificate.pem。

```bash
openssl pkcs12 -in PrivateKey.p12 -out PrivateKey.pem -nodes
openssl x509 -trustout -inform DER -outform PEM -in Certificate.cer -out Certificate.pem
```

### 下载根证书和中间证书

本文使用 AppleIncRootCertificate.cer 根证书和 AppleApplicationIntegrationCA5G1.cer 中间证书，更多证书可以访问 Apple PKI。下载完成后通过命令行从 Root Certificate 和 Intermediate Certificate 提取 Certificates 和 Keys，参考 [INFO.SSL](info.ssl.com/article.aspx?id=12149)。

```bash
openssl x509 -trustout -inform DER -outform PEM -in AppleIncRootCertificate.cer -out Root.pem
openssl x509 -trustout -inform DER -outform PEM -in AppleApplicationIntegrationCA5G1.cer -out Intermediate.pem
```

将 Intermediate.pem 和 Root.pem 中的文本内容合并为一份文件 AppleIncCertificateChain.pem，此时 AppleIncCertificateChain.pem 将会包含两份证书。

### 签名

1. 打开“应用程序”文件夹内“实用工具”文件夹中的“终端”。
2. 在获取管理员权限之后，在“终端”中键入或粘贴以下命令。

```bash
openssl smime \
    -sign \
    -in UnsignedProfile.mobileconfig \
    -out SignedProfile.mobileconfig \
    -signer Certificate.pem \
    -inkey PrivateKey.pem \
    -certfile AppleIncCertificateChain.pem \
    -outform der -nodetach
```

## 进一步了解

1. [Free SSL/TLS Certificates](https://letsencrypt.org/)
2. [possible status of a mobileconfig? - Apple Community](https://discussions.apple.com/thread/2363234)
3. [Apple PKI](https://www.apple.com/certificateauthority/)
4. [在 macOS 服务器中创建自签名证书 - Apple 支持](https://support.apple.com/zh-cn/guide/server/apd2474fbab/mac)