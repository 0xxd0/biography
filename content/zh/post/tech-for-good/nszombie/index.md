---
title: NSZombie 实现原理
subtitle: NSZombie 实现原理
summary: NSZombie 实现原理
projects: [project-NSZombie]
date: 2016-12-03T20:44:39.000Z
lastmod: 2016-12-03T21:00:39.000Z
draft: false
cip_code: '11.0701'
featured: false
image:
  caption: NSZombie
  focal_point: Smart
  placement: 1
  preview_only: false
authors:
- admin
tags:
categories:
- PBD. Platform-Based Development
- Apple Platform
cips:
- 11.07) Computer Science
- 11.0701) Computer Science
links:
- icon: github
  icon_pack: fab
  name: GitHub
  url: https://github.com/0xxd0/NSZombie
---

## 前言

Xcode 的 scheme 设置中存在一个 Zombie Objects 的开关，这个开关直接作用于 `NSZombieEnabled` 标志位也就是僵尸对象，首先简单总结对象内存的一些状态。

#### 对象的几种内存状态

1. 内存泄漏：对象存在例如循环引用的情况导致 ARC 无法清 0 无法被释放。
1. 野指针：通常访问被系统回收的内存会触发 `EXC_BAD_ACCECC`。
1. 空指针：地址为 `nil` 或者 `null`，在 Objective-C 中对 `nil` 发消息是安全的。
1. `_NSZombie_`：在 `NSObject` 对象 `dealloc` 时将 `isa` 指向一个 Zombie 类且不释放内存，此时对象的状态为 `deallocated`。

通常情况下，当向已经释放的 Objective-C 对象也就是野指针发送消息到时，会导致消息发送到被重新分配的内存，或者是已经被内核回收的内存，也就是所谓的 "use after free"，无论是哪种结果，都会造成 Crash。如果这段内存被分配给一个新的 Objective-C 对象，那么会导致 `selector` 无法识别而 Crash，如果恰好该对象也有该方法的话，那么会发生预期之外的事情。在 ARC 的辅助下，`overrelease` 的问题会减少很多，但比如在多线程、MRC 的情况下仍然会出现内存管理的问题。

因此对于野指针或者 `overrelease` 的问题，我们通常需要引入 `_NSZombie_` 僵尸对象来排查。开启 `NSZombieEnabled` 后，Xcode 会在 Run scheme 时会将 `NSZombieEnabled` 作为一个环境变量传入，它控制了应用在生命周期内是否使用僵尸对象，此时对 `deallocated` 的对象发送消息不再会导致 Crash，而是会触发 `message sent to deallocated instance` 错误。僵尸对象的实现会与原有对象的析构与回收挂钩，原有对象 `dealloc` 时并没有释放所占内存，而是将 `isa` 指向一个 Zombie 类，这样在有消息发给该 `deallocated` 对象时，Zombie 对象都能拦截到消息。所以 Zombie 对象通常用于排查 `overrelease`、野指针等问题。

由于 Zombie 类不会释放内存、会潜在的导致内存泄漏，所以在 Release Build 时 `NSZombieEnabled` 需要被禁用。


## CoreFoundation 的 NSZombie

`_NSZombie_` 对象具体在 `CoreFoundation` 层实现

```shell
Class _NSZombie_ is implemented in both /System/Library/Frameworks/CoreFoundation.framework/Versions/A/CoreFoundation (0x7fff889fd658) and ...
```

Objective-C runtime 会在环境初始化时去获取 `NSZombiesEnabled` 标志位，最终是为了开启 `DebugPoolAllocation`，`DebugPoolAllocation` 主要服务于 AutoReleasePool，若 `DebugPoolAllocation = true` 每次 push 会生成一个新的 pool page。

```cpp
/// objc4/runtime/objc-runtime.mm
void environ_init(void) {
  // ···
  if (maybeMallocDebugging) {
    const char *insert = getenv("DYLD_INSERT_LIBRARIES");
    const char *zombie = getenv("NSZombiesEnabled");
    const char *pooldebug = getenv("OBJC_DEBUG_POOL_ALLOCATION");
    if ((getenv("MallocStackLogging")
        || getenv("MallocStackLoggingNoCompact")
        || (zombie && (*zombie == 'Y' || *zombie == 'y'))
        || (insert && strstr(insert, "libgmalloc")))
        && (!pooldebug || 0 == strcmp(pooldebug, "YES"))) {
        DebugPoolAllocation = true;
    }
  }
}
```

## 实现一个 NSZombie

### NSZombie 基类

僵尸对象不需要继承于 `NSObject` 所以可以直接构造一个基类：

```objectivec
NS_ROOT_CLASS
@interface _NSZombie_ {
    Class isa;
}
```

在 Objective-C 中每个类在第一次发送消息前都会先调用 `+initialize` 进行初始化。如果运行时发现该类没有实现 `+initialize` 方法，会直接进行消息转发，而我们不想让这个情况发生，所以需要给基类添加 `+initialize` 空实现：

```objectivec
+ (void)initialize {
}
```

## 进一步了解

1. [Friday Q&A 2014-11-07: Let's Build NSZombie](https://www.mikeash.com/pyblog/friday-qa-2014-11-07-lets-build-nszombie.html)
1. [Finding zombies - Instruments Help](https://help.apple.com/instruments/mac/current/#/dev612e6956).
1. [What is NSZombie? - Stack Overflow](https://stackoverflow.com/questions/4168327/what-is-nszombie)
1. [NSObject | Apple Developer Documentation](https://developer.apple.com/documentation/objectivec/nsobject#//apple_ref/occ/clm/NSObject/initialize)
1. [What's required to implement root class of Objective-C? - Stack Overflow](https://stackoverflow.com/questions/3582209/whats-required-to-implement-root-class-of-objective-c)

1. [NSZombieEnabled](https://gist.github.com/JeOam/e62c95a0b4c21974bcf6)
1. [使用僵尸对象辅助调试 –](http://ibloodline.com/articles/2016/09/01/NSZombie.html)
1. [Release 模式下的Zombie检查工具](http://blog.douzhongxu.com/2017/08/ZombieObjectCheck/)