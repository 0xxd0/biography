---
title: CFRuntime
linktitle: CFRuntime
type: book
date: 2017-06-18T10:31:29.000Z
draft: true
authors:
- admin
tags:
- CoreFoundation
cip_code: '11.0701'
categories:
- PBD. Platform-Based Development
- Apple Platform
cips:
- 11.07) Computer Science
- 11.0701) Computer Science
weight: 11
---

## CFRuntime

CoreFoundation 隐藏了 `__CFOAInitialize` 的具体实现：

```c
void __CFOAInitialize(void) {
    static void (*dyfunc)(void) = (void *)~0;
    if (NULL == __CFgetenv("OAKeepAllocationStatistics")) return;
    if ((void *)~0 == dyfunc) {
	    dyfunc = dlsym(RTLD_DEFAULT, "_OAInitialize");
    }
    if (NULL != dyfunc) {
	    dyfunc();
	    __CFObjectAllocRecordAllocationFunction = dlsym(RTLD_DEFAULT, "_OARecordAllocationEvent");
	    __CFObjectAllocSetLastAllocEventNameFunction = dlsym(RTLD_DEFAULT, "_OASetLastAllocationEventName");
	    __CFOASafe = true;
    }
}
```

`__CFObjectAllocRecordAllocationFunction` 用于记录对象内存事件，主调方为 `__CFRecordAllocationEvent`。

## 进一步了解

1. [swift-corelibs-foundation/CFRuntime.c](https://github.com/apple/swift-corelibs-foundation/blob/main/CoreFoundation/Base.subproj/CFRuntime.c)