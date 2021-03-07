---
title: 深入了解 WebSocket Protocol
subtitle: WebSocket 协议详解
summary: WebSocket 协议详解
projects: []
date: 2017-05-06T00:00:00.000Z
lastmod: 2017-05-06T00:00:00.000Z
draft: false
cip_code: '11.0701'
featured: false
image:
  caption: WebSocket
  focal_point: Smart
  placement: 2
  preview_only: false
authors:
- admin
tags:
- WebSocket
categories:
- NC. Networking and Communication
cips:
- 11.07) Computer Science
- 11.0701) Computer Science
links:
- icon_pack: far
  icon: file-pdf
  name: RFC 6455
  url: https://tools.ietf.org/pdf/rfc6455.pdf
---

## WebSocket 握手

WebSocket 为第 7 层应用层协议，建立连接的握手流程依赖于 4 层 TCP，由于 WebSocket 通过利用 HTTP 发起握手，所以这里的握手更类似于一次对 HTTP 协议切换的请求。

### Client 请求 

WebSocket 的请求和 HTTP 的格式是一致的, 每行会以 `\r\n` 字符结尾，请求头的结束处也需要另起一行空白行：

```http
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com
```

最大的区别在于 WebSoeckt 的请求头会在 HTTP 的基础上带上 WS 协议切换标志位，告诉服务端将 HTTP 升级为 WebSocket。

```http
Upgrade: websocket
Connection: Upgrade
```

### Server 响应

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
Sec-WebSocket-Protocol: chat
```

## 进一步了解

1. [The WebSocket Protocol](https://tools.ietf.org/pdf/rfc6455.pdf)
1. [The WebSocket API (WebSockets)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API).
1. [WebSocket](https://en.wikipedia.org/wiki/WebSocket).