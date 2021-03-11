---
title: Override
linktitle: Override
type: book
date: 2017-01-01T10:31:29.000Z
draft: true
authors:
- admin
tags:
- Swift
cip_code: '11.0701'
categories:
- PL. Programming Languages
- The Objective-C Programming Language
cips:
- 11.07) Computer Science
- 11.0701) Computer Science
weight: 11
---

## Override declaration in Extension

Extensions can add new functionality to a type, but they can’t override existing functionality.

[swift/TypeCheckDeclOverride.cpp](https://github.com/apple/swift/blob/a4ba8653a00f66709e82e69adb489a7a0ca204cc/lib/Sema/TypeCheckDeclOverride.cpp#L1889)

### ERROR `Cannot override a non-dynamic class declaration from an extension`

Semantic Diagnostics [`override_class_declaration_in_extension`](https://github.com/apple/swift/blob/main/include/swift/AST/DiagnosticsSema.def#L2587)

### ERROR `Overriding non-@objc declarations from extensions is not supported`

## 进一步了解

1. [swift/override.swift](https://github.com/apple/swift/blob/main/test/decl/inherit/override.swift).
1. [swift/TypeCheckDeclOverride.cpp](https://github.com/apple/swift/blob/a4ba8653a00f66709e82e69adb489a7a0ca204cc/lib/Sema/TypeCheckDeclOverride.cpp).
1. [swift/DiagnosticsSema.def](https://github.com/apple/swift/blob/main/include/swift/AST/DiagnosticsSema.def)