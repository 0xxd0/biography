---
title: 深入了解 SSL/TSL Protocol
subtitle: SSL/TSL 协议详解
summary: SSL/TSL 协议详解
projects: []
date: 2017-05-21T00:00:00.000Z
lastmod: 2017-05-21T00:00:00.000Z
draft: false
cip_code: '11.0701'
featured: false
image:
  caption: TSL
  focal_point: Smart
  placement: 2
  preview_only: false
authors:
- admin
tags:
- TSL
categories:
- NC. Networking and Communication
cips:
- 11.07) Computer Science
- 11.0701) Computer Science
---

SSL/TLS 作为 HTTPS 的协议支撑，主要用于网络传输过程中的加密与身份认证。最新版本为 2018 年 3 月 IESG 批准的 TLS 1.3。SSL/TLS 建立于 TCP 之上，为应用层协议。TLS 协议主要由两层构成，为 TLS Record Protocol 和 TLS Handshaking Protocols。前者基于一些可信任的协议如 TCP，为上层协议提供数据封装、压缩、加密等基本功能的支持，保证数据传输过程中的完整性和私密性，属于较低层的协议，而后者负责握手过程中的身份认证。


{{% vimeo 135666049 %}}

## TLS Handshaking Protocols


## TLS Record Protocol


## 进一步了解

1. [The Transport Layer Security (TLS) Protocol Version 1.3](https://datatracker.ietf.org/doc/rfc8446/).
1. [Transport Layer Security - Wikipedia](https://en.wikipedia.org/wiki/Transport_Layer_Security).
1. [What is SSL? | SSL definition](https://www.cloudflare.com/learning/ssl/what-is-ssl/).