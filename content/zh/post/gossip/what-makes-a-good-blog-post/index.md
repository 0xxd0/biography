---
title: 如何写出一篇好博文
subtitle: 善用写作工具以及表现手法

# Summary for listings and search engines
summary: 善用写作工具以及表现手法

# Link this post with a project
projects: []

# Date published
date: 2019-09-11T00:00:00Z

# Date updated
lastmod: 2019-09-11T00:00:00Z

# Is this an unpublished draft?
draft: true

# Show this page in the Featured widget?
featured: true

# Featured image
# Place an image named `featured.jpg/png` in this page's folder and customize its options here.
image:
  caption: ''
  focal_point: ""
  placement: 1
  preview_only: false

authors:
- admin

tags:
- Essay

categories:
- Gossip
---

## 序

谈起这个博客，建立之初只是为了记录一些技术相关的话题，用来沉淀一些日常学习的技术知识点以及做备忘用。随着时间流逝已经 5 个年头了，写作也变成了一个习惯保持了下来，也不断的尝试从原来的计算机科学学术类逐渐扩大到 STEM 乃至其他的各类型的文章。

{{< cta cta_text="**创篇号** (2014)" cta_link="/post/gossip/first-post" cta_new_tab="true" >}}

随着不断的学习与深入，就越发会觉得自身各类知识面的狭窄与片面，潜在的求知欲被这种外在的驱动力所激发，促使着你不断挖掘知识的深度与拓宽学术广度。在写作过程中，如何组织与管理跨学科文章，如何针对选题主旨拿捏文本表现形式成为了不小的问题。由于理工科和文科在学术侧重上的区别会导致行文风格和段落组织大相径庭，比如 STEM 更强调数理逻辑和科学证明，会以各类图表和数据来增加文本说服力；在文章的选题上存在强调客观事实的文档或者说明类，也存在发表个人观点的强主观意愿的内容，不同的文章会有不同的处理方式，后续有机会抽几个章节赘述。


## 为什么要写文章

就如美国物理学家[约翰·阿奇博尔德·惠勒](https://en.wikipedia.org/wiki/John_Archibald_Wheeler)所说：

> “One can only learn by teaching.” — John Archibald Wheeler

以教为学被 是一个很好的学习方法，如果一个复杂深奥的问题能用直白浅显的语言讲清楚并传授给他人，那么说明这个知识点已经被学习者真正理解并运用。通常这么做可以促使你剖析知识要点，用你自己对领域知识的了解程度去做易懂的总结，这个过程会促使你回顾你学习过的内容，对知识盲区进行查漏补缺，直到最终能够用大白话、最简单的术语去描述并让人听懂。从个人角度来说，写文章的本质就是学习的沉淀，沉淀的目的是为了提炼再利用，这个过程就是一个知识的提炼总结以及教授传递。就好比字典、词典存在的意义：

- 提供语言领域内的使用指南
- 字、词汇、语言的知识点速查
- 知识的传递

写文章简单，写出有深度的文章难，写出即易懂又有深度的文章是难中之难。只学不沉淀必然会遗忘，再次遇到同样的问题就需要花时间重新回忆或直接踩坑，这就是写作与沉淀的目的。同样，在提炼沉淀之余，分类与索引也是必不可少的，上文提到写作的重要目的之一是再利用，如果只是写了文章而从不去使用，那就好比把一篇很有营养的文章加入了你的收藏夹，心想下次一定能用到，渐渐的你就会发现收藏夹越来越臃肿难以管理，最终变成你成长过程中的过客，这样的场景是不是似曾相识。

所以本博客的所有文章会以忽略选题的内容为前提，把文章内容涉及到的学科领域作为类别归属，在此基础上以 CIP 的策略作分类化管理，使得学科特定的知识点查找与索引会非常简便。


## 写作工具

### 用富媒体润色文本

#### 图床

出于各种目的，比如减少服务器的压力、加快加载速度、减少发布包的体积等，图片资源会通常以 CDN 的形式来存储与部署，这里就要用到各种 CDN 服务。

- ##### GitHub `user-images`

    在 GitHub 提 `issue` 时添加图片，GitHub 会将图片资源会分发至 CDN，生成地址为 `user-images.githubusercontent.com/{path}/{hash}` 的链接，从某种角度来看 GitHub 可以用来作图床。


### 用更强说服力的图表代替语言

#### Mermaid

[Mermaid](https://mermaid-js.github.io/mermaid/#/) 是一个集流程图、状态图、时序图、甘特图绘制库，使用 DSL 代码就可以绘制出漂亮清晰的图片，配合上 markdown 是 STEM 相关文章的利器，同时提供了[在线编辑器](https://mermaid-js.github.io/mermaid-live-editor/)提供实时预览。

#### Plotly

[Plotly](https://plotly.com) 是一个通过 `JSON` 作为数据源的图标绘制工具，并且提供了可视化[在线编辑工具](http://plotly-json-editor.getforge.io)。


## 文章的表现力

表现力需要更具选题的内容来作具体调整。

### STEM


## 进一步了解

1. {{< cite page="first-post" view="4" >}}