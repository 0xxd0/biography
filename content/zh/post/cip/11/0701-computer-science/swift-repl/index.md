---
title: Swift REPL
subtitle: Swift REPL 使用大全

# Summary for listings and search engines
summary: Swift REPL 使用大全

# Link this post with a project
projects: []

# Date published
date: 2016-10-18T15:44:16Z

# Date updated
lastmod: 2016-10-18T16:44:16Z

# Is this an unpublished draft?
draft: true

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
- REPL
- Swift

categories:
- PL. Programming Languages
- The Swift Programming Language

cips: 
- 11.07 Computer Science 
- 11.0701 Computer Science
---

## Swift REPL

The Swift REPL includes a helper `:print_decl <name> - print the AST representation of the named declarations`.

```bash
#! /bin/sh
# usage: <shellscript> [--osx] typename

if [ "$1" = "--osx" ] ; then
    echo "import Cocoa\n:print_decl $2" | xcrun swift -deprecated-integrated-repl
else
    sdk_path=$(echo `xcrun --show-sdk-path` | sed 's#MacOSX.platform/Developer/SDKs/MacOSX10.10.sdk#iPhoneSimulator.platform/Developer/SDKs/iPhoneSimulator8.0.sdk#')
    echo "import UIKit\n:print_decl $1" | xcrun swift -deprecated-integrated-repl -sdk "$sdk_path"
fi
```

**Note 1**: The script defaults to using the iOS SDK. If you want to use the OS X SDK use the "--osx" option as the first parameter

**Note 2**: I prefer to leave out the file output that is part of the blog post so that I can use this script in other ways than just file generation


## 进一步了解

1. [How can I retrieve Swift “header” files for Cocoa APIs?](https://stackoverflow.com/questions/24887454/how-can-i-retrieve-swift-header-files-for-cocoa-apis)