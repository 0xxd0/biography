---
title: 如何监控与优化 iOS 二进制代码段体积
subtitle: IPA 瘦身实践
summary: 监控与优化 iOS 二进制代码段体积
projects: []
date: 2016-11-25T10:31:29.000Z
lastmod: 2016-11-25T11:31:29.000Z
cip_code: '11.0701'
draft: true
featured: false
image:
  caption: __TEXT
  focal_point: Smart
  placement: 1
  preview_only: false
authors:
- admin
tags:
- Objective-C
- iOS
- LinkMap
- App Thinning
categories:
- PBD. Platform Based Development
- Apple Platform
- iOS
cips:
- 11.07) Computer Science
- 11.0701) Computer Science
---

{{< cite page="/whole-module-optimizations" view="4" >}}

{{< toc >}}

```mermaid
sequenceDiagram
  participant Alice
  participant Bob
  Alice->John: Hello John, how are you?
  loop Healthcheck
      John->John: Fight against hypochondria
  end
  Note right of John: Rational thoughts <br/>prevail...
  John-->Alice: Great!
  John->Bob: How about you?
  Bob-->John: Jolly good!
```

```mermaid
gantt
  dateFormat  YYYY-MM-DD
  section Section
  A task           :a1, 2014-01-01, 30d
  Another task     :after a1  , 20d
  section Another
  Task in sec      :2014-01-12  , 12d
  another task      : 24d
```
