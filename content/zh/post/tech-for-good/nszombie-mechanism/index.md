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

对于野指针或者 `overrelease` 的问题，我们通常需要引入 Zombie 对象来排查。开启 `NSZombieEnabled` 后，Xcode 会在 Run scheme 时将 `NSZombieEnabled` 作为一个环境变量传入，它控制了应用在生命周期内是否使用 Zombie 对象，此时对 `deallocated` 的对象发送消息不再会导致 Crash，而是会触发 `message sent to deallocated instance` 错误。Zombie 对象的实现与普通对象的析构与内存回收有关，普通对象 `dealloc` 时并没有释放所占内存，而是将 `isa` 指向一个 Zombie 类，达到 Zombie 化的效果，之后再有消息发给此 `deallocated` 对象时，Zombie 对象就能接收到消息。

此处 `isa` 的 Zombie 类都与原有的类一一对应，目的是在 Zombie 对象接受到消息后，可以反向定位到原有类，Zombie 类命名规则为 `_NSZombie_` + `Class Name` (e.g. `_Zombie_NSObject`)。

正因为有此套机制，Zombie 对象通常能够帮助排查定位 `overrelease`、野指针等问题。

### NSZombie 的使用

`NSZombieEnabled` 会对所有通过正常方式析构的 Objective-C 对象生效，包括大多数 Cocoa 类以及用户创建的类。在 Mac OS X 10.4 及更早版本上，大多数 Toll-Free Bridged 的 CoreFoundation 类型由于使用 CoreFoundation 进行进行析构，所以需要使用 CFZombie 达到类似的效果。从 Mac OS X 10.5 起，`NSZombieEnabled` 也将适用于 Toll-Free Bridged 类。更多详细可以参考头文件：

```shell
/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/System/Library/Frameworks/Foundation.framework/Versions/C/Headers/NSDebug.h
```

此外由于 `NSZombieEnabled` 开启后对象不会释放内存，会潜在的导致内存泄漏以及占用大量的内存，所以在 release build 时 `NSZombieEnabled` 需要被禁用。如果在调试过程中经常需要使用 Zombie 对象，可以将 scheme 进行 Duplicate 并对 scheme 副本开启 `NSZombieEnabled`，方便轻松切换；亦或者直接从终端传入环境变量运行应用程序：

```bash
env NSZombieEnabled=YES /path/to/executable
```

## CoreFoundation 中 NSZombie 的实现

### 启用 NSZombie

通过 Duplicated Symbol 的方式定位到 `_NSZombie_` 对象是在 `CoreFoundation` 层实现：

```shell
Class _NSZombie_ is implemented in both /System/Library/Frameworks/CoreFoundation.framework/Versions/A/CoreFoundation (0x7fff889fd658) and ...
```

Objective-C runtime 会在环境初始化时去获取 `NSZombiesEnabled` 标志位，最终是为了开启服务于 AutoReleasePool 的 `DebugPoolAllocation`，若 `DebugPoolAllocation = true` 每次 push 会生成一个新的 pool page。

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

### Zombify

对象的 Zombie 化主要由 `__CFZombifyNSObject` 实现，观察符号断点：

```
CoreFoundation`__CFZombifyNSObject:
->  0x7fff204303b6 <+0>:  pushq  %rbp
    0x7fff204303b7 <+1>:  movq   %rsp, %rbp
    0x7fff204303ba <+4>:  pushq  %r15
    0x7fff204303bc <+6>:  pushq  %r14
    0x7fff204303be <+8>:  pushq  %rbx
    0x7fff204303bf <+9>:  pushq  %rax
    0x7fff204303c0 <+10>: leaq   0x24baa3(%rip), %rdi      ; "NSObject"
    0x7fff204303c7 <+17>: callq  0x7fff204ab4c4            ; symbol stub for: objc_lookUpClass
    0x7fff204303cc <+22>: movq   %rax, %rbx
    0x7fff204303cf <+25>: movq   0x6694566a(%rip), %rsi    ; "dealloc"
    0x7fff204303d6 <+32>: movq   0x66946873(%rip), %r14    ; "__dealloc_zombie"
    0x7fff204303dd <+39>: movq   %rax, %rdi
    0x7fff204303e0 <+42>: callq  0x7fff204ab056            ; symbol stub for: class_getInstanceMethod
    0x7fff204303e5 <+47>: movq   %rax, %r15
    0x7fff204303e8 <+50>: movq   %rbx, %rdi
    0x7fff204303eb <+53>: movq   %r14, %rsi
    0x7fff204303ee <+56>: callq  0x7fff204ab056            ; symbol stub for: class_getInstanceMethod
    0x7fff204303f3 <+61>: movq   %r15, %rdi
    0x7fff204303f6 <+64>: movq   %rax, %rsi
    0x7fff204303f9 <+67>: addq   $0x8, %rsp
    0x7fff204303fd <+71>: popq   %rbx
    0x7fff204303fe <+72>: popq   %r14
    0x7fff20430400 <+74>: popq   %r15
    0x7fff20430402 <+76>: popq   %rbp
    0x7fff20430403 <+77>: jmp    0x7fff204ab3c2            ; symbol stub for: method_exchangeImplementations
```

很显然这是一个针对 `dealloc` 的 Method Swizzle，很容易的得出 `__CFZombifyNSObject` 在 Objective-C 中的实现：

```objectivec
void __CFZombifyNSObject(void) {
    Class cls = objc_lookUpClass("NSObject");
    Method dealloc_zombie = class_getInstanceMethod(cls, @selector(__dealloc_zombie));
    Method dealloc = class_getInstanceMethod(cls, @selector(dealloc));
    method_exchangeImplementations(dealloc_zombie, dealloc);
}
```

也就是说 Zombify 的实现是通过 swizzle 了 `NSObject.dealloc` 方法实现的，通过 `__dealloc_zombie` 完成 Zombie 化对象以及特殊的内存管理操作：

```
CoreFoundation`-[NSObject(NSObject) __dealloc_zombie]:
->  0x7fff20430b28 <+0>:   pushq  %rbp
    0x7fff20430b29 <+1>:   movq   %rsp, %rbp
    0x7fff20430b2c <+4>:   pushq  %r14
    0x7fff20430b2e <+6>:   pushq  %rbx
    0x7fff20430b2f <+7>:   subq   $0x10, %rsp
    0x7fff20430b33 <+11>:  movq   0x5fbfc5de(%rip), %rax    ; (void *)0x00007fff86d4a0e0: __stack_chk_guard
    0x7fff20430b3a <+18>:  movq   (%rax), %rax
    0x7fff20430b3d <+21>:  movq   %rax, -0x18(%rbp)
    0x7fff20430b41 <+25>:  testq  %rdi, %rdi
    0x7fff20430b44 <+28>:  js     0x7fff20430be3            ; <+187>
    0x7fff20430b4a <+34>:  movq   %rdi, %rbx
    0x7fff20430b4d <+37>:  cmpb   $0x0, 0x669553ac(%rip)    ; __CFConstantStringClassReferencePtr + 7
    0x7fff20430b54 <+44>:  je     0x7fff20430bfc            ; <+212>
    0x7fff20430b5a <+50>:  movq   %rbx, %rdi
    0x7fff20430b5d <+53>:  callq  0x7fff204ab55a            ; symbol stub for: object_getClass
    0x7fff20430b62 <+58>:  leaq   -0x20(%rbp), %r14
    0x7fff20430b66 <+62>:  movq   $0x0, (%r14)
    0x7fff20430b6d <+69>:  movq   %rax, %rdi
    0x7fff20430b70 <+72>:  callq  0x7fff204ab068            ; symbol stub for: class_getName
    0x7fff20430b75 <+77>:  leaq   0x24086f(%rip), %rsi      ; "_NSZombie_%s"
    0x7fff20430b7c <+84>:  movq   %r14, %rdi
    0x7fff20430b7f <+87>:  movq   %rax, %rdx
    0x7fff20430b82 <+90>:  xorl   %eax, %eax
    0x7fff20430b84 <+92>:  callq  0x7fff204aaf90            ; symbol stub for: asprintf
    0x7fff20430b89 <+97>:  movq   (%r14), %rdi
    0x7fff20430b8c <+100>: callq  0x7fff204ab4c4            ; symbol stub for: objc_lookUpClass
    0x7fff20430b91 <+105>: movq   %rax, %r14
    0x7fff20430b94 <+108>: testq  %rax, %rax
    0x7fff20430b97 <+111>: jne    0x7fff20430bb6            ; <+142>
    0x7fff20430b99 <+113>: leaq   0x240282(%rip), %rdi      ; "_NSZombie_"
    0x7fff20430ba0 <+120>: callq  0x7fff204ab4c4            ; symbol stub for: objc_lookUpClass
    0x7fff20430ba5 <+125>: movq   -0x20(%rbp), %rsi
    0x7fff20430ba9 <+129>: movq   %rax, %rdi
    0x7fff20430bac <+132>: xorl   %edx, %edx
    0x7fff20430bae <+134>: callq  0x7fff204ab476            ; symbol stub for: objc_duplicateClass
    0x7fff20430bb3 <+139>: movq   %rax, %r14
    0x7fff20430bb6 <+142>: movq   -0x20(%rbp), %rdi
    0x7fff20430bba <+146>: callq  0x7fff204ab23c            ; symbol stub for: free
    0x7fff20430bbf <+151>: movq   %rbx, %rdi
    0x7fff20430bc2 <+154>: callq  0x7fff204ab470            ; symbol stub for: objc_destructInstance
    0x7fff20430bc7 <+159>: movq   %rbx, %rdi
    0x7fff20430bca <+162>: movq   %r14, %rsi
    0x7fff20430bcd <+165>: callq  0x7fff204ab572            ; symbol stub for: object_setClass
    0x7fff20430bd2 <+170>: cmpb   $0x0, 0x66955328(%rip)    ; __CFZombieEnabled
    0x7fff20430bd9 <+177>: je     0x7fff20430be3            ; <+187>
    0x7fff20430bdb <+179>: movq   %rbx, %rdi
    0x7fff20430bde <+182>: callq  0x7fff204ab23c            ; symbol stub for: free
    0x7fff20430be3 <+187>: movq   0x5fbfc52e(%rip), %rax    ; (void *)0x00007fff86d4a0e0: __stack_chk_guard
    0x7fff20430bea <+194>: movq   (%rax), %rax
    0x7fff20430bed <+197>: cmpq   -0x18(%rbp), %rax
    0x7fff20430bf1 <+201>: jne    0x7fff20430c1c            ; <+244>
    0x7fff20430bf3 <+203>: addq   $0x10, %rsp
    0x7fff20430bf7 <+207>: popq   %rbx
    0x7fff20430bf8 <+208>: popq   %r14
    0x7fff20430bfa <+210>: popq   %rbp
    0x7fff20430bfb <+211>: retq   
    0x7fff20430bfc <+212>: movq   0x5fbfc515(%rip), %rax    ; (void *)0x00007fff86d4a0e0: __stack_chk_guard
    0x7fff20430c03 <+219>: movq   (%rax), %rax
    0x7fff20430c06 <+222>: cmpq   -0x18(%rbp), %rax
    0x7fff20430c0a <+226>: jne    0x7fff20430c1c            ; <+244>
    0x7fff20430c0c <+228>: movq   %rbx, %rdi
    0x7fff20430c0f <+231>: addq   $0x10, %rsp
    0x7fff20430c13 <+235>: popq   %rbx
    0x7fff20430c14 <+236>: popq   %r14
    0x7fff20430c16 <+238>: popq   %rbp
    0x7fff20430c17 <+239>: jmp    0x7fff204aaee8            ; symbol stub for: _objc_rootDealloc
    0x7fff20430c1c <+244>: callq  0x7fff204aae5e            ; symbol stub for: __stack_chk_fail
```

方法大致流程：

1. 判断 `__CFConstantStringClassReferencePtr + 7` 的值，如果为 `0` 则函数执行完毕。(类的索引值常量，与编译器内置的 `decl` 匹配)
1. 通过 `object_getClass` 与 `class_getName` 获取当前对象的类名。
1. 调用 `asprintf`，将类名格式化至字符串 `_NSZombie_%s`，存入 `rdi` 寄存器。
1. 调用 `objc_lookUpClass`，查找 Zombie 类是否存在，如果不存在则新创建。
1. 调用 `objc_lookUpClass`，获取 `_NSZombie_` 类。
1. 调用 `objc_duplicateClass` 复制 `_NSZombie_` 类，生成新的 `_NSZombie_%s` 类。
1. 释放字符串 `_NSZombie_%s`。
1. 调用 `objc_destructInstance` 销毁当前实例，保留内存不释放。
1. 通过函数 `object_setClass` 将当前对象 `isa` 指向 `_NSZombie_%s` 类。
1. `__CFZombieEnabled` 通常与 `__CFDeallocateZombies` 互斥，判断 `__CFZombieEnabled` 是否为 `false` 或者说 `__CFDeallocateZombies` 是否为 `true`，若是则释放 Zombie 对象，释放内存。

创建 Zombie 类的工作由 `objc_duplicateClass()` 完成，它会把整个 `_NSZombie_` 类结构拷贝并赋予新的名字，父类、实例变量和方法都和复制之前相同，此函数主要被 Foundation 用于  实现 `KVO`，之所以不使用 `objc_allocateClassPair`、`objc_registerProtocol` 构造 `_NSZombie_` 继承链的原因猜测主要是性能问题。

`_NSZombie_` 为 Root Class，没有基类同时也没有实现任何方法，只有一个 `isa` 指针。在 Objective-C 中可以被实例化的类都必须有一个 `isa` 指针用于指向 Class 对象。Objective-C 对象为 struct，通过 `class_getInstanceSize` 获取 allocation 的大小，直接使用 `malloc` 就能构造实例：

```objectivec
+ (instancetype)new {
    id object = malloc(class_getInstanceSize(self));
    object->isa = self;
    return object;
}
```

更多关于 `__CFZombifyNSObject` 和 `__dealloc_zombie` 的内容移步参考：

{{< cite page="cf-NSObject" view="3" >}}

### `___forwarding___`

Zombie 类的定位作用会在消息转发的过程中体现。上文提到 `_NSZombie_` 是一个什么方法都没有实现的 Root Class，所以任何发给它的消息都会经过 full forwarding mechanism，在完整的消息转发机制中，`___forwarding___` 是核心，Debug 时经常可以在调用栈中看到这个函数。从汇编来看 `___forwarding___` 中很重要的一个步骤是检查接受消息的对象的类名，判断前缀是否为 `_NSZombie_`：

```
CoreFoundation`___forwarding___:
    ···
    0x7fff204e4c02 <+320>:  leaq   0x36091d(%rip), %rsi      ; "_NSZombie_"
    0x7fff204e4c09 <+327>:  movl   $0xa, %edx
    0x7fff204e4c0e <+332>:  movq   %r12, %rdi
    0x7fff204e4c11 <+335>:  callq  0x7fff2063f22c            ; symbol stub for: strncmp
    0x7fff204e4c16 <+340>:  testl  %eax, %eax
    0x7fff204e4c18 <+342>:  je     0x7fff204e4f7e            ; <+1212>
    ···
    0x7fff204e4f7e <+1212>: movq   -0x138(%rbp), %rdi
    0x7fff204e4f85 <+1219>: movq   %r12, %rsi
    0x7fff204e4f88 <+1222>: movq   -0x140(%rbp), %rdx
    0x7fff204e4f8f <+1229>: callq  0x7fff20637d54            ; ___forwarding___.cold.1
->  0x7fff204e4f94 <+1234>: movq   %r15, %rdi
```

`<+342>` 对 `strncmp` 的结果进行了判断，如果是 `_NSZombie_` 则表明消息接收者是 Zombie 对象需要特殊处理，`je` 到 `<+1212>` 进入 `___forwarding___.cold.1`：

```
CoreFoundation`___forwarding___.cold.1:
    0x7fff20637d54 <+0>:  pushq  %rbp
    0x7fff20637d55 <+1>:  movq   %rsp, %rbp
    0x7fff20637d58 <+4>:  pushq  %r15
    0x7fff20637d5a <+6>:  pushq  %r14
    0x7fff20637d5c <+8>:  pushq  %rbx
    0x7fff20637d5d <+9>:  pushq  %rax
    0x7fff20637d5e <+10>: movq   %rdx, %r15
    0x7fff20637d61 <+13>: movq   %rsi, %rbx
    0x7fff20637d64 <+16>: movq   %rdi, %r14
    0x7fff20637d67 <+19>: leaq   0x68448412(%rip), %rax    ; __CFOASafe
    0x7fff20637d6e <+26>: cmpb   $0x0, (%rax)
    0x7fff20637d71 <+29>: je     0x7fff20637d85            ; <+49>
    0x7fff20637d73 <+31>: pushq  $0x15
    0x7fff20637d75 <+33>: popq   %rdi
    0x7fff20637d76 <+34>: movq   %r14, %rsi
    0x7fff20637d79 <+37>: xorl   %edx, %edx
    0x7fff20637d7b <+39>: xorl   %ecx, %ecx
    0x7fff20637d7d <+41>: xorl   %r8d, %r8d
    0x7fff20637d80 <+44>: callq  0x7fff205cd93e            ; __CFRecordAllocationEvent
    0x7fff20637d85 <+49>: addq   $0xa, %rbx
    0x7fff20637d89 <+53>: movq   %r15, %rdi
    0x7fff20637d8c <+56>: callq  0x7fff2063f178            ; symbol stub for: sel_getName
    0x7fff20637d91 <+61>: leaq   0x5fd683b8(%rip), %rsi    ; @"*** -[%s %s]: message sent to deallocated instance %p"
    0x7fff20637d98 <+68>: pushq  $0x3
    0x7fff20637d9a <+70>: popq   %rdi
    0x7fff20637d9b <+71>: movq   %rbx, %rdx
    0x7fff20637d9e <+74>: movq   %rax, %rcx
    0x7fff20637da1 <+77>: movq   %r14, %r8
    0x7fff20637da4 <+80>: xorl   %eax, %eax
    0x7fff20637da6 <+82>: callq  0x7fff2055d4dc            ; CFLog
->  0x7fff20637dab <+87>: ud2
```

最终 `___forwarding___.cold.1` 会打印一条消息，以本文附属的项目为例：

```shell
*** -[NSZombieTests.TestClass retainWeakReference]: message sent to deallocated instance 0x100effff0
```

其中原有类的类名是从 Zombie 类名去掉前缀 `_NSZombie_` 处理后得到的，更多关于 `__CFOASafe` 和 `__CFRecordAllocationEvent` 的内容移步参考：

{{< cite page="cf-CFRuntime" view="3" >}}

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
1. [Root class| Cocoa Core Competencies](https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/RootClass.html)
1. [What's required to implement root class of Objective-C? - Stack Overflow](https://stackoverflow.com/questions/3582209/whats-required-to-implement-root-class-of-objective-c)
1. [objc_zombie.mm | chromium](https://chromium.googlesource.com/chromium/src/+/d2b44bd628c85b8d7150a533b6c8a6b857211aa8/chrome/browser/cocoa/objc_zombie.mm)