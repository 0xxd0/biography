---
title: "关于 NSURL +URLWithString: 返回 nil"
subtitle: URL Percent-encoding

# Summary for listings and search engines
summary: URL Percent-encoding

# Link this post with a project
projects: []

# Date published
date: 2014-12-03T20:44:39Z

# Date updated
lastmod: 2014-12-03T21:00:39Z

# Is this an unpublished draft?
draft: false

# Show this page in the Featured widget?
featured: false

# Featured image
# Place an image named `featured.jpg/png` in this page's folder and customize its options here.
image:
  caption: 'Cocoa Foundation'
  focal_point: "Smart"
  placement: 1
  preview_only: false

authors:
- admin

tags:
- Cocoa
- Foundation

categories:
- Computer Science 
- PBD. Platform-Based Development
- Apple Platform
---

当 url 字符串中含有特殊字符时，例如空格、汉字等，则必须对 url 字符串进行转义编码，否则 `[NSURL URLWithString: urlString]` 将返回 `nil`。

```objc
#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSString *urlString = [NSString stringWithFormat: @"https://www.google.com.hk/search?q=WWDC 2014"];
        NSURL *url = [NSURL URLWithString:urlString];
        NSLog(@"%@", url);
    }
    return 0;
}
```

输出的 url 结果为。

```
21:07:11.784 test[8883:320995] (null)
```

对 `urlString` 进行编码以及输出的 `url` 结果。

```objc
#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSString *urlString = [NSString stringWithFormat: @"https://www.google.com.hk/search?q=WWDC 2014"];
        NSURL *url = [NSURL URLWithString: [urlString stringByAddingPercentEscapesUsingEncoding: NSUTF8StringEncoding]];
        NSLog(@"%@", url);
    }
    return 0;
}
```

```
21:09:18.640 test[8985:327779] https://www.google.com.hk/search?q=WWDC%202014
```

空格被转义为 `UTF-8` 编码，例如汉字"的"的 `UTF-8` 编码为 `0xE7 0x9A 0x84`，percent encode 之后就是 `%E7%9A%84`。


{{% callout note %}} 2015-07-20 Updated {{% /callout %}}

在 iOS 9.0 / OSX 10.11 之后 `- stringByReplacingPercentEscapesUsingEncoding:` 就被废弃了，我们可以用 `- stringByAddingPercentEncodingWithAllowedCharacters:` 代替，参数类型为 `NSCharacterSet`。这个方法会把所有 Character Set 以外的字符进行 `UTF-8 Percent Encoding`，支持 url 编码的 Character Set 有如下所示。

```objc
+ URLFragmentAllowedCharacterSet  // 7-bit ASCII 不包含 "#%<>[\]^`{|}
+ URLHostAllowedCharacterSet      // 7-bit ASCII 不包含 "#%/<>?@\^`{|}
+ URLPasswordAllowedCharacterSet  // 7-bit ASCII 不包含 "#%/:<>?@[\]^`{|}
+ URLPathAllowedCharacterSet      // 7-bit ASCII 不包含 "#%;<>?[\]^`{|}
+ URLQueryAllowedCharacterSet     // 7-bit ASCII 不包含 "#%<>[\]^`{|}
+ URLUserAllowedCharacterSet      // 7-bit ASCII 不包含 "#%/:<>?@[\]^`
```

自定义的 `NSCharacterSet` 如下所示。

```objc
[[NSCharacterSet characterSetWithCharactersInString:@" \"#%/:<>?@[\\]^`{|}"] invertedSet]
```

所以最终的编码以及控制台输出就如下所示。

```objc
#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSString *urlString = [NSString stringWithFormat:@"https://www.google.com.hk/search?q=WWDC 2014"];
        NSURL *url = [NSURL URLWithString: [urlString stringByAddingPercentEncodingWithAllowedCharacters: NSCharacterSet.URLQueryAllowedCharacterSet]];
        NSLog(@"%@", url);
    }
    return 0;
}
```

```
21:09:18.640 test[8985:327779] https://www.google.com.hk/search?q=WWDC%202014
```