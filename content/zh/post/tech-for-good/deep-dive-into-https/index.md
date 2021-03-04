---
title: 深入了解 HTTPS
subtitle: HTTPS 详解
summary: HTTPS 详解
projects: []
date: 2017-05-31T00:00:00.000Z
lastmod: 2017-05-31T00:00:00.000Z
draft: false
cip_code: '11.0701'
featured: false
image:
  caption: HTTPS
  focal_point: Smart
  placement: 2
  preview_only: false
authors:
- admin
tags:
- HTTPS
categories:
- NC. Networking and Communication
cips:
- 11.07) Computer Science
- 11.0701) Computer Science
---

HTTP 协议 (Hypertext Transfer Protocol) 作为 C/S 模式下常用的协议，主要用于传输超文本，本质上 HTTP 为明文无任何安全保证，主要存在三大风险:

1. 被窃听的风险，第三方可以截获并查看你的内容
2. 被篡改的危险，第三方可以截获并修改你的内容
3. 被冒充的风险，第三方可以伪装成通信方与你通信

HTTP 因为存在以上三大安全风险，才诞生了 HTTPS。HTTPS 会涉及到很多领域比如 SSL/TLS、密码学、公钥与私钥、加密与认证、数字证书、数字签名等。要讲清楚 HTTPS，首先需要了解什么是数字签名。

## 数字签名是什么

{{< cite page="what-is-a-digital-signature-translation-and-annotation" view="4" >}}

## 进一步了解

1. [What is a Digital Signature?](http://www.youdzone.com/signature.html)