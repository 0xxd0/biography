---
title: 客户端架构演进
subtitle: 未来客户端架构的模式
summary: 未来客户端架构的模式
projects: []
date: 2020-03-21T15:44:16.000Z
lastmod: 2020-03-21T16:44:16.000Z
draft: true
cip_code: '11.0701'
featured: false
image:
  caption: Bazel
  focal_point: Smart
  placement: 1
  preview_only: false
authors:
- admin
tags:
- Architecture
categories:
- SE. Software Engineering
cips:
- 11.07) Computer Science
- 11.0701) Computer Science
---

## 原生应用

通常来说版本的发布与需求的迭代有强绑定关系，久而久之版本需求的不断臃肿，整体节奏也会变的拖泥带水。意通常来说为了加速这一过程愈来越多的公司采取了赶班车制度。

### 班车制度

但是班车制度解决的只是需求发布频率的问题，客户端相比于服务端、前端来说最大的问题


## 热更新时代的混合应用

随着业务迭代的加速，整个应用体系会逐渐膨胀，一次次的迭代使得业务逐渐臃肿，能否热更新

## 大一统的跨平台应用

## 环境隔离容器化

## 未来，应用架构引擎化

业务的具体实现与客户端隔离，客户端的职责下沉至业务的动态解析组装与任务编排，中台提供业务描述，采用 DSL 对业务进行描述，就如 Lua 之于 Unreal Engine 一样，渲染与逻辑分离，客户端的职责成为了一个业务引擎。


## 进一步了解

1. [bazelbuild/rules_apple](https://github.com/bazelbuild/rules_apple).
1. [bazelbuild/rules_swift](https://github.com/bazelbuild/rules_swift).