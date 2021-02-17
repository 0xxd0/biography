---
title: Clang Attributes 使用文档
subtitle: Clang Attributes 实战备忘录

# Summary for listings and search engines
summary: Clang Attributes 实战备忘录

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

{{% callout note %}} Continually Updated {{% /callout %}}

`__attribute__` 最初作为 GNU C 的特性，为 C/C++、Objective-C/C++ 提供了编译器级别的标注，用来修饰一个变量、函数或类型，包括但不限于以下特性。

- [Function Attributes](https://gcc.gnu.org/onlinedocs/gcc/Function-Attributes.html)
- [Variable Attributes](https://gcc.gnu.org/onlinedocs/gcc/Variable-Attributes.html)
- [Type Attributes](https://gcc.gnu.org/onlinedocs/gcc/Type-Attributes.html)
- [Label Attributes](https://gcc.gnu.org/onlinedocs/gcc/Label-Attributes.html)
- [Enumerator Attributes](https://gcc.gnu.org/onlinedocs/gcc/Enumerator-Attributes.html)
- [Statement Attributes](https://gcc.gnu.org/onlinedocs/gcc/Statement-Attributes.html)

同样 Clang 也很好的兼容了 GGC 这一特性，并做了额外的扩展。

- [Calling Conventions](http://clang.llvm.org/docs/AttributeReference.html#calling-conventions)
- [Nullability Attributes](http://clang.llvm.org/docs/AttributeReference.html#nullability-attributes)
- [AMD GPU Attributes](http://clang.llvm.org/docs/AttributeReference.html#amd-gpu-attributes)
- [Consumed Annotation Checking](http://clang.llvm.org/docs/AttributeReference.html#consumed-annotation-checking)
- [Type Safety Checking](http://clang.llvm.org/docs/AttributeReference.html#type-safety-checking)
- [OpenCL Address Spaces](http://clang.llvm.org/docs/AttributeReference.html#opencl-address-spaces)
- [Customizing Swift Import](https://clang.llvm.org/docs/AttributeReference.html#customizing-swift-import)

诸如优化、错误检查之类的机械化任务理应由编译器去完成，但常言道“工欲善其事，必先利其器”只有让编译器更加懂你，才能把编译器的性能、优化发挥到极致。

{{% toc %}}


## Variable Attributes

### `noescape`

| GNU | C++11 | C2x | __declspec | Keyword | Pragma | Pragma clang attribute |
| - | - | - | - | - | - | - |
| `noescape` | `clang::noescape` | `clang::noescape` | | | | Yes |


### `section, __declspec(allocate)`

| GNU | C++11 | C2x | __declspec | Keyword | Pragma | Pragma clang attribute |
| - | - | - | - | - | - | - |
| `section` | `gnu::section` | `gnu::section` | `allocate` | | | Yes |

`section` 特性使得我们能将指定的变量或者函数插入到指定 section 中，比如把一个字符串直接塞入数据段。

```c
char *string __attribute((section("__DATA, Custom"))) = "I'm a pure string."
```

### `used`

`__attribute((used))` 用来修饰变量或者函数。通常默认情况下，没有被引用的符号会被链接器优化去除。标注 `used` 之后意味着即使符号没有被引用，也不会被连接器优化掉。


## Type Attributes

### `objc_root_class`

在 `Foundation` 中对应 `OBJC_ROOT_CLASS`，`__attribute__((objc_root_class))` 用于申明一个没有根类的 objc class，我们可以利用这个特性实现类似 `name space` 的效果，使得 ObjC 变得更 Swift。

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

### `overloadable`

| GNU | C++11 | C2x | __declspec | Keyword | Pragma | Pragma clang attribute |
| - | - | - | - | - | - | - |
| `overloadable` | `clang::overloadable` | `clang::overloadable` | | | | Yes |

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

void __attribute__((overloadable)) detectTypeof(NSInteger i) {
    fprintf(stdout, "%s\n", @encode(typeof(i)));
}

void __attribute__((overloadable)) detectTypeof(CGFloat f) {
    fprintf(stdout, "%s\n", @encode(typeof(f)));
}

void __attribute__((overloadable)) detectTypeof(NSString *string) {
    fprintf(stdout, "%s: NSString\n", @encode(typeof(string)));
}

void __attribute__((overloadable)) detectTypeof(NSArray *array) {
    fprintf(stdout, "%s: NSArray\n", @encode(typeof(array)));
}

void __attribute__((overloadable)) detectTypeof(NSObject *object) {
    fprintf(stdout, "%s: NSObject\n", @encode(typeof(object)));
}

int main(int argc, const char * argv[]) {
    detectTypeof((NSInteger)1);
    detectTypeof(1.0);
    detectTypeof(@"Hello");
    detectTypeof(@[@(1)]);
    detectTypeof(NSObject.new);
    
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

## Customizing Swift Import

### `swift_bridge`

| GNU | C++11 | C2x | __declspec | Keyword | Pragma | Pragma clang attribute |
| - | - | - | - | - | - | - |
| `swift_bridge` | | | | | | Yes |

`swift_bridge` 用于将 ObjC 的声明和 Swift 类型进行 Bridge，为 Swift Interoperability 的体现，更多可以参考 [WWDC](https://developer.apple.com/videos/play/wwdc2015/401/)。Swift 标准库中的相当一部分类型都有 Interoperability 特性，与 Cocoa 有一层隐式 bridge，比如 `NSArray`、`NSMutableArray` 和 `Swift.Array`。

下方例子中，ObjC 类 `DerivatedObjCClass` 被 bridge 到 Swift 中的 `DerivatedClass`。

```
__attribute__((objc_root_class))
@interface BaseClass
- (instancetype)init;
@end

__attribute__((__swift_bridge__("DerivatedClass")))
@interface DerivatedObjCClass: BaseClass
@end
```

更多相关内容可以参考 LLVM 的 Phab Review D87532 [Sema: add support for `__attribute__((__swift_bridge__))`](https://reviews.llvm.org/D87532) 以及 swift 的 [ClangImporter](https://github.com/apple/swift/blob/41d5e57b5586fccd4ba3823e8ac4690b7b30ec59/lib/ClangImporter/ImportType.cpp#L944)。


### `swift_bridged`

| GNU | C++11 | C2x | __declspec | Keyword | Pragma | Pragma clang attribute |
| - | - | - | - | - | - | - |
| `swift_bridged` | | | | | | Yes |

在 CoreFoundation 中对应 `CF_SWIFT_BRIDGED_TYPEDEF`，配合 `swift_bridge` 使用，用于被 `swift_bridge` 描述的类型的 `typedef` 类型。以 `NSString` -> `Swift.String` 为例，在 ObjC 中有如下声明：

```objc
@interface NSString;
typedef NSString *AliasedString __attribute__((__swift_bridged_typedef__));

extern void foo(AliasedString _Nonnull str);
```

在 Swift 中会被 Bridge 为：

```swift
func foo(_ str: String) -> Void
```

这个操作同样会由 Swift Compiler 直接完成，无需开发者手动声明。


### `swift_name`

| GNU | C++11 | C2x | __declspec | Keyword | Pragma | Pragma clang attribute |
| - | - | - | - | - | - | - |
| `swift_name` | | | | | | Yes |

在 CoreFoundation 中对应 `CF_SWIFT_NAME`，`swift_name` 为 C/ObjC 的声明提供了在 Swift 中符号名，默认情况会根据 Swift Compiler 的算法规则自动生成。

```
@interface NSData

- (instancetype)initWithData:(NSData *)data __attribute__((__swift_name__("Data.init(_:)")));

@end

void __attribute__((__swift_name__("squareRoot()"))) sqrtf(float f);

```

### `swift_newtype`

| GNU | C++11 | C2x | __declspec | Keyword | Pragma | Pragma clang attribute |
| - | - | - | - | - | - | - |
| `swift_newtype` `swift_wrapper` | | | | | | Yes |

在 CoreFoundation 中对应 `_CF_TYPED_EXTENSIBLE_ENUM`。


## 进一步了解

1. [Attributes in Clang](http://clang.llvm.org/docs/AttributeReference.html)
2. [Attribute Syntax](https://gcc.gnu.org/onlinedocs/gcc/Attribute-Syntax.html)
3. [Enumerator Attributes](https://gcc.gnu.org/onlinedocs/gcc/Enumerator-Attributes.html)
4. [Compiler-specific Features](https://www.keil.com/support/man/docs/armcc/armcc_chr1359124965789.htm)
5. [NSHipster __ attribute __](http://nshipster.com/__attribute__)