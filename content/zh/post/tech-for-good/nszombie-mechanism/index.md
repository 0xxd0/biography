---
title: NSZombie 实现机制
subtitle: 自己动手实现一个 NSZombie
summary: 自己动手实现一个 NSZombie
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

Xcode 的 scheme 设置中存在一个 Zombie Objects 的开关，这个开关直接作用于 `NSZombieEnabled` 标志位也就是 Zombie 对象，Zombie 对象主要用于排查内存问题，所以首先需要了解常见的对象的内存状态。

### 对象的几种内存状态

1. 内存泄漏：对象存在例如循环引用的情况导致 ARC 无法清 0 无法被释放。
1. 野指针：通常访问被系统回收的内存会触发 `EXC_BAD_ACCECC`。
1. 空指针：地址为 `nil` 或者 `null`，在 Objective-C 中对 `nil` 发消息是安全的。
1. `_NSZombie_`：在 `NSObject` 对象 `dealloc` 时将 `isa` 指向一个 Zombie 类且不释放内存，此时对象的状态为 `deallocated`。

通常情况下，向已经释放的 Objective-C 对象也就是野指针发送消息到时，会导致消息发送到被重新分配的内存，或者是已经被内核回收的内存，也就是所谓的 "use after free"，此时会造成 `EXC_BAD_ACCECC` Crash。如果这段内存被分配给一个新的 Objective-C 对象，那么会导致 `selector` 无法识别而 Crash，如果恰好该对象也实现了这个方法，那么会发生预期之外的事情。在 ARC 的辅助下，内存相关的问题会减少很多，但比如在多线程、MRC 的情况下仍然会出现内存管理的问题。

### NSZombie 的机制

对于野指针或者 `overrelease` 的问题，我们通常需要引入 Zombie 对象来排查。开启 `NSZombieEnabled` 后，Xcode 会在 Run scheme 时会将 `NSZombieEnabled` 作为一个环境变量传入，它控制了应用在生命周期内是否使用 Zombie 对象，此时对 `deallocated` 的对象发送消息不再会导致 Crash，而是会触发 `message sent to deallocated instance` 错误。Zombie 对象的实现会与原有对象的析构与内存回收有关，原有对象 `dealloc` 时并没有释放所占内存，而是将 `isa` 指向一个 Zombie 类，将类 Zombie 化，之后再有消息发给此 `deallocated` 对象时，Zombie 对象就能接收到消息。

此处 `isa` 的 Zombie 类都与原有类一一对应，目的是在 Zombie 对象接受到消息后，可以反向定位到原有类，Zombie 类命名规则为 `_NSZombie_` + `Class Name` (e.g. `_Zombie_NSObject`)。

正因为有此套机制，Zombie 对象通常能够帮助排查定位 `overrelease`、野指针等问题。

### NSZombie 的使用

`NSZombieEnabled` 会对所有通过正常方式析构的 Objective-C 对象生效，包括大多数 Cocoa 类以及用户创建的类。在 10.4 及更早版本上，大多数 Toll-Free Bridged 的 CoreFoundation 类型由于使用 CoreFoundation 进行进行析构，所以需要使用 CFZombie 以达到类似的效果。从 10.5 起，`NSZombieEnabled` 也将适用于 Toll-Free Bridged 类。更多详细可以参考头文件：

```shell
/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/System/Library/Frameworks/Foundation.framework/Versions/C/Headers/NSDebug.h
```

此外由于 `NSZombieEnabled` 开启后对象不会释放内存，会潜在的导致内存泄漏以及占用大量的内存，所以在 release build 时 `NSZombieEnabled` 需要被禁用。如果在调试过程中经常需要使用 Zombie 对象，可以将 scheme 进行 Duplicate 并对 scheme 副本开启 `NSZombieEnabled`，方便轻松切换；亦或者直接从终端传入环境变量运行应用程序：

```bash
env NSZombieEnabled=YES /path/to/executable
```

## CoreFoundation 中 NSZombie 的实现

通过 Duplicated Symbol 的方式定位到 `_NSZombie_` 对象是在 `CoreFoundation` 层实现：

```shell
Class _NSZombie_ is implemented in both /System/Library/Frameworks/CoreFoundation.framework/Versions/A/CoreFoundation (0x7fff889fd658) and ...
```

Objective-C runtime 会在环境初始化时去获取 `NSZombiesEnabled` 标志位，最终是为了开启 `DebugPoolAllocation`，`DebugPoolAllocation` 主要服务于 AutoReleasePool，若 `DebugPoolAllocation = true` 每次 push 会生成一个新的 pool page。

```cpp
/// objc4/runtime/objc-runtime.mm
void environ_init(void) {
  ···
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
  ···
}
```

`zombie_dealloc` 会修改对象的 `isa` 指针，将其指向 Zombie 类，Zombie 类能接收到所有发送给原有类的消息：

```objectivec

```

创建新类的工作由 `objc_duplicateClass()` 完成，它会把整个 `_NSZombie_` 类结构拷贝并赋予新的名字，父类、实例变量和方法都和复制之前相同，此函数主要用于 Foundation 实现 `KVO`。之所以不使用 `objc_allocateClassPair`、`objc_registerProtocol` 构造 `_NSZombie_` 继承链的原因主要也是性能问题。

`_NSZombie_` 为 Root Class，没有基类同时也没有实现任何方法，只有一个 `isa` 指针。在 Objective-C 中可以被实例化的类都必须有一个 `isa` 指针用于指向 Class 对象，Objective-C 对象为 struct，通过 `class_getInstanceSize` 获取 allocation 的大小，直接使用 `malloc` 就能构造实例：

```objectivec
+ (instancetype)new {
    id object = malloc(class_getInstanceSize(self));
    object->isa = self;
    return object;
}
```

Zombie 类的定位作用会在消息转发的过程中体现。上文提到 `_NSZombie_` 是一个什么方法都没有实现的 Root Class，所以任何发给它的消息都会经过 full forwarding mechanism，在完整的消息转发机制中，`___forwarding___` 是核心，Debug 时经常可以在调用栈中看到这个函数。`___forwarding___` 中很重要的一个步骤是检查接受消息的对象所属的类名，若名称前缀为 `_NSZombie_` 则表明消息接受者是 Zombie 对象需要特殊处理，此时会打印一条消息，以本文附属的项目为例：

```shell
*** -[NSZombieTests.TestClass retainWeakReference]: message sent to deallocated instance 0x100effff0
```

其中原有类的类名是从 Zombie 类名去掉前缀 `_NSZombie_` 处理后得到的。

## 实现一个 NSZombie

### NSZombie 基类

Zombie 对象不需要继承于 `NSObject` 所以可以直接构造一个基类：

```objectivec
NS_ROOT_CLASS
@interface _NSZombie_ {
    Class isa;
}
```

根据[苹果文档](https://developer.apple.com/documentation/objectivec/nsobject#//apple_ref/occ/clm/NSObject/initialize)，在 Apple Objective-C 2.0 runtime 中每个类在第一次发送消息前都会先调用 `+initialize` 进行初始化。如果运行时发现该类没有实现 `+initialize` 方法，会直接进行消息转发，而我们不想让这个情况发生，所以需要给基类添加 `+initialize` 空实现：

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

1. [Release 模式下的Zombie检查工具](http://blog.douzhongxu.com/2017/08/ZombieObjectCheck/)