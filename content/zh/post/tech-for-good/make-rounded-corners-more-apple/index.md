---
title: 如何画出更具有 Apple 风格的圆角
subtitle: Apple 圆角的实现
summary: Apple 圆角的实现
projects: []
date: 2019-11-15T00:00:00.000Z
lastmod: 2019-11-15T00:00:00.000Z
draft: false
cip_code: '11.0701'
featured: false
image:
  caption: Protobuf
  focal_point: Smart
  placement: 2
  preview_only: false
authors:
- admin
tags:
- Protobuf
categories:
- NC. Networking and Communication
cips:
- 11.07) Computer Science
- 11.0701) Computer Science
links:
gallery_item:
- album: rounded-rect
  image: a-cornerradius-rounded.png
  caption: CornerRadius
- album: rounded-rect
  image: b-bezier-rounded.png
  caption: UIBezierPath
- album: rounded-rect
  image: c-rounded-overlay.png
  caption: UIBezierPath over CornerRadius
- album: rounded-rect
  image: d-rounded-diff.png
  caption: CornerRadius - UIBezierPath
---

## 如何画出 Rounded Rect

在 Apple 平台上，通常在实现圆角时会使用 CoreAnimation 的 `CALayer.cornerRadius`：

```swift
view.layer.cornerRadius = 8
```

讲究一点的情况下为了避免离屏渲染会利用 `CAShapeLayer` 去 Clip 一个 View：

```swift
let bounds = CGRect(x: 0, y: 0, width: 300, height: 300)
let radius = 30
let view = UIView(frame: bounds)
view.backgroundColor = .red

let maskPath = UIBezierPath(roundedRect: bounds,
                            byRoundingCorners: .allCorners,
                            cornerRadii: CGSize(width: radius, height: radius))
let shapeLayer = CAShapeLayer()
shapeLayer.frame = bounds
shapeLayer.path = maskPath.cgPath
view.layer.mask = shapeLayer
```

圆角是由曲线构成的，对曲线的变化率求导得到曲率 G1，称为曲率；对曲率 G1 求导可以得到曲率的变化率 G2。在直接使用 `cornerRadius` 的情况下，圆角的绘制是用一个内切圆实现的，所圆角与直边的连接处的曲率会有一个数值上的跳动，此时曲率的变化是不连续的，也就是说 G1 是不连续的，在视觉上会呈现出生涩的过度，而直接使用 `UIBezierPath` 去画 `roundedRect` 则不会出现这个问题。下方的样例代码将 `cornerRadius` 与 `UIBezierPath` 的实现做了差分对比：

```swift
override func viewDidLoad() {
  super.viewDidLoad()
  let width = view.bounds.width - 40
  let bounds = CGRect(x: 0, y: 0, width: width, height: width)
  let radius = width / 2 - 70

  let view1 = UIView(frame: bounds)
  view1.backgroundColor = .pinkRed

  let view2 = UIView(frame: bounds)
  view2.backgroundColor = .pinkBlue

  view1.addSubview(view2)
  view.addSubview(view1)

  let maskPath = UIBezierPath(roundedRect: bounds,
                              byRoundingCorners: .allCorners,
                              cornerRadii: .init(width: radius, height: radius))
  let shapeLayer = CAShapeLayer()
  shapeLayer.frame = bounds
  shapeLayer.path = maskPath.cgPath
  view2.layer.mask = shapeLayer

  view1.layer.cornerRadius = .init(radius)
  view1.center = view.center
}
```

下方图中蓝色的部分是 `UIBezierPath` 圆角，而红色的部分是 `cornerRadius` 圆角，能够观察到红色与蓝色部分没有完全重叠，多出来的红色部分就是造成生涩过度的根本原因。

{{< gallery album="rounded-rect" >}}

关于圆角的视觉感官之前撰写过一篇关于苹果如何处理圆角的文章，在此就不做过多赘述。

{{< cite page="rounded-corners-in-apple-ecosystem" view="3" >}}

## Continuous Rounded Corners in CoreAnimation

狡猾的苹果早期就在 CoreAnimation 中预留了 Private API `CALayer.continuousCorners` 来为他们自己提供 G1 连续的圆角，开发者们可以通过一个分类声明来使用这个属性：

```objc
@interface CALayer (Undocumented)

@property (assign) BOOL continuousCorners;

@end
```

但相应的提审时就需要做一些混淆防止被拒。从 iOS 13 起，CoreAnimation 终于提供了 `CALayer.cornerCurve` 用于描述曲线的渲染方式，使用 `CALayerCornerCurve.continuous` 可以绘制出 G1 连续的圆角：

```swift
if #available(iOS 13.0, *) {
    view.layer.cornerCurve = .continuous
} else {
    view.layer.continuousCorners = true
}
```

## Squircle


## 进一步了解

1. [Squircle - Wikipedia](https://en.wikipedia.org/wiki/Squircle)
1. [rdar://44420870: CALayer.continuousCorners should be made public API to allow all apps to use platform-standard superlliptical corners on arbitrary views](http://www.openradar.me/44420870)
1. [rdar://42040072: Make -[CALayer setContinuousCorners:] public](https://openradar.appspot.com/42040072)