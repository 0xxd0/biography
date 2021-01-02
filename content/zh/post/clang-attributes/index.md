---
title: 巧用 Clang Attributes
subtitle: Clang Attributes 实战手册

# Summary for listings and search engines
summary: Clang Attributes 实战手册

# Link this post with a project
projects: []

# Date published
date: 2015-11-28T15:44:16Z

# Date updated
lastmod: 2015-11-28T16:44:16Z

# Is this an unpublished draft?
draft: false

# Show this page in the Featured widget?
featured: false

# Featured image
# Place an image named `featured.jpg/png` in this page's folder and customize its options here.
image:
  caption: Clang
  focal_point: Smart
  placement: 1
  preview_only: false

authors:
- admin

tags:
- Compiler
- Clang

categories:
- Computer Science 
- PL. Programming Languages
---


###### ⚠️ 不定期更新

`__attribute__` 最初作为 `GCC` 的特性，为 `C/C++`、`Objective-C/C++` 提供了源代码级别的标注，用来修饰一个变量、函数或类型，包括了以下特性。

- [`Function Attributes`](https://gcc.gnu.org/onlinedocs/gcc/Function-Attributes.html)[¶](#Function-Attributes)
    - `overloadable (clang::overloadable)`

- [`Variable Attributes`](https://gcc.gnu.org/onlinedocs/gcc/Variable-Attributes.html)[¶](#Variable-Attributes)
- [`Type Attributes`](https://gcc.gnu.org/onlinedocs/gcc/Type-Attributes.html)[¶](#Type-Attributes)
    - `objc_root_class`

- [`Label Attributes`](https://gcc.gnu.org/onlinedocs/gcc/Label-Attributes.html)[¶](#Label-Attributes)

- [`Enumerator Attributes`](https://gcc.gnu.org/onlinedocs/gcc/Enumerator-Attributes.html)[¶](#Enumerator-Attributes)

- [`Statement Attributes`](https://gcc.gnu.org/onlinedocs/gcc/Statement-Attributes.html)[¶](#Statement-Attributes)

同样 Clang 也很好的兼容了 GGC 这一特性，并做了额外的扩展。

- [`Calling Conventions`](http://clang.llvm.org/docs/AttributeReference.html#calling-conventions)[¶](#Function-Attributes)

- [`AMD GPU Attributes`](http://clang.llvm.org/docs/AttributeReference.html#amd-gpu-attributes)[¶](#AMD-GPU-Attributes)

- [`Consumed Annotation Checking`](http://clang.llvm.org/docs/AttributeReference.html#consumed-annotation-checking)[¶](#Consumed-Annotation-Checking)

- [`Type Safety Checking`](http://clang.llvm.org/docs/AttributeReference.html#type-safety-checking)[¶](#Type-Safety-Checking)

- [`OpenCL Address Spaces`](http://clang.llvm.org/docs/AttributeReference.html#opencl-address-spaces)[¶](#OpenCL-Address-Spaces)

- [`Nullability Attributes`](http://clang.llvm.org/docs/AttributeReference.html#nullability-attributes)[¶](#Nullability-Attributes)

虽然诸如优化、错误检查之类的大部分应该由编译器去完成，但是工欲善其事，必先利其器，只有让编译器更加懂你，才能把编译器的性能、优化发挥到极致。


## Type Attributes

### `objc_root_class`

`Foundation` 中对应 `OBJC_ROOT_CLASS`，`__attribute__((objc_root_class))` 用于申明一个没有根类的 objc class，我们可以利用这个特性实现类似 `name space` 的效果，变得更 Swifty。

```objc
__attribute__((objc_root_class)) @interface NotificationName

@property (class, readonly) NSNotificationName NSApplicationDidFinishLaunching;

@end

@implementation NotificationName

+ (NSNotificationName)NSApplicationDidFinishLaunching {
    return NSApplicationDidFinishLaunchingNotification;
}

@end
```

## Function Attributes

### `overloadable (clang::overloadable)`

| GNU | C++11 | C2x | __declspec | Keyword | Pragma | Pragma clang attribute |
| --- | ----- | --- | ---------- | ------- | ------ | ---------------------- |
| ✔ ︎  |✔︎      |     |            |         |        | ✔︎                      |

Clang 为 C 引入了和 C++ 一样的 `name mangling`，使用 `overloadable` 对 C 函数进行 `overload`。

```c
#include <math.h>

float __attribute__((overloadable)) tgsin(float x) {
    return sinf(x);
}
double __attribute__((overloadable)) tgsin(double x) { 
    return sin(x); 
}
long double __attribute__((overloadable)) tgsin(long double x) { 
    return sinl(x); 
}
```

会得到类似于 `_Z5tgsinf`、`_Z5tgsind`、`_Z5tgsine` 这三个符号，同样对于 ObjC Type。
 

```objc
#import <Foundation/Foundation.h>

void __attribute__((overloadable)) _typeof(NSInteger i) {
    fprintf(stdout, "%s\n", @encode(typeof(i)));
}

void __attribute__((overloadable)) _typeof(CGFloat f) {
    fprintf(stdout, "%s\n", @encode(typeof(f)));
}

void __attribute__((overloadable)) _typeof(NSString *string) {
    fprintf(stdout, "%s: NSString\n", @encode(typeof(string)));
}

void __attribute__((overloadable)) _typeof(NSArray *array) {
    fprintf(stdout, "%s: NSArray\n", @encode(typeof(array)));
}

void __attribute__((overloadable)) _typeof(NSObject *object) {
    fprintf(stdout, "%s: NSObject\n", @encode(typeof(object)));
}

int main(int argc, const char * argv[]) {
    _typeof((NSInteger)1);
    _typeof(1.0);
    _typeof(@"Hello");
    _typeof(@[@(1)]);
    _typeof(NSObject.new);
    
    return 0;
}
```

运行结果如下所示。

```bash
q
d
@: NSString
@: NSArray
@: NSObject
```


## 进一步了解

1. [Attributes in Clang](http://clang.llvm.org/docs/AttributeReference.html)
2. [Attribute Syntax](https://gcc.gnu.org/onlinedocs/gcc/Attribute-Syntax.html)
3. [Enumerator Attributes](https://gcc.gnu.org/onlinedocs/gcc/Enumerator-Attributes.html)
4. [NSHipster __ attribute __](http://nshipster.com/__attribute__)