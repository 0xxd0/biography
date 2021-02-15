---
title: 如何监控与优化 iOS 二进制代码段体积
subtitle: ipa 瘦身实践

# Summary for listings and search engines
summary: 监控与优化 iOS 二进制代码段体积

# Link this post with a project
projects: []

# Date published
date: 2016-11-25T10:31:29Z

# Date updated
lastmod: 2016-11-25T11:31:29Z

# Is this an unpublished draft?
draft: true

# Show this page in the Featured widget?
featured: false

# Featured image
# Place an image named `featured.jpg/png` in this page's folder and customize its options here.
image:
  caption: '__TEXT'
  focal_point: "Smart"
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
- Computer Science 
- PBD. Platform Based Development
- Apple Platform
- iOS
---

{{< cite page="/whole-module-optimizations" view="4" >}}

{{< toc >}}

{{< cta cta_text="Do something" cta_link="/" cta_new_tab="false" >}}

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
