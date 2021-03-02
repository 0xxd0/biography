---
title: 什么是数字签名【译注】

subtitle: 用 Bob 的故事简单介绍数字签名

# Summary for listings and search engines
summary: 用 Bob 的故事简单介绍数字签名

# Link this post with a project
projects: []

# Date published
date: 2017-05-25T00:00:00Z

# Date updated
lastmod: 2017-05-25T00:00:00Z

# Is this an unpublished draft?
draft: false

# Show this page in the Featured widget?
featured: false

# Featured image
# Place an image named `featured.jpg/png` in this page's folder and customize its options here.
image:
  caption: 'Digital Signature'
  focal_point: "Smart"
  placement: 2
  preview_only: false

authors:
- admin

tags:
- Digital Signature

categories:
- NC. Networking and Communication

cips: 
- 11.07 Computer Science 
- 11.0701 Computer Science
---

## 前言

故事的主人公是 Bob，他有三个好朋友 Pat、Doug 和 Susan。Bob 经常跟他们写信，因为他的信是明文传输 的，在传递过程可能被人截获偷窥，也可能被人截获然后又篡改了，更有可能别人伪装成 Bob 本人跟他的好 朋友通信，总之是不安全的。他很苦恼，经过一番苦苦探索，诶，他发现计算机安全学里有一种叫非对称加密算法的东东，好像可以帮助他解决这个问题。正文部分会添加个人的译注作为补充介绍一些背景与看法，接下来我们来看看 Bob 是怎么用非对称加密与好友通信的。

{{% callout note %}} 非对称加密 {{% /callout %}}

> 非对称加密算法（RSA）是内容加密的一类算法，它有两个秘钥，公钥与私钥：
>
> - 公开的、可以被所有人都可以获取的称之为公钥。
> - 只有持有者知道，其他任何人获取不到的称之为私钥。
>
> 通过公钥加密的内容，只能通过私钥解密，同样通过私钥加密的内容也只能用公钥解密，公钥和私钥只有称谓上不同，本质上没有任何区别，是很典型的用途决定命名。通常私钥加密公钥解密，我们称之为身份认证；公钥加密私钥解密，我们称之为加密。非对称加密算法的安全性很高，但因为计算量庞大，比较消耗性能。

## 正文

1、鲍勃得到了两把钥匙。鲍勃的钥匙其中一把称为公钥，另一把称为私钥。

<p style="font-size:5rem;"> :girl: </p>

<p style="font-size:5rem;"> :boy: </p>

<p style="font-size:5rem;"> :cop: </p>

<p style="font-size:5rem;">  </p>

:trollface:

2、Bob 自己保留下了私钥，把公钥复制成三份送给了他的三个好朋友 Pat、Doug 和 Susan

3、此时，Bob 总算可以安心地和他的好朋友愉快地通信了。比如Susan要和他讨论关于去哪吃午饭的事 情，Susan就可以先把自己的内容(明文)首先用Bob送给他的公钥做一次加密，然后把加密的内容传送给 Bob。Bob收到信后，再用自己的私钥解开信的内容。
说明:这其实是计算机安全学里加密的概念，加密的目的是为了不让别人看到传送的内容，加密的手段是通 过一定的加密算法及约定的密钥进行的(比如上述用了非对称加密算法以及Bob的公钥)，而解密则需要相 关的解密算法及约定的秘钥(如上述用了非对称加密算法和Bob自己的私钥)，可以看出加密是可逆的(可 解密的)

4、Bob 看完信后，决定给Susan回一封信。为了防止信的内容被篡改(或者别人伪装成他的身份跟Susan 通信)，他决定先对信的内容用hash算法做一次处理，得到一个字符串哈希值，Bob又用自己的私钥对哈 希值做了一次加密得到一个签名，然后把签名和信(明文的)一起发送给Susan
说明2:Bob的内容实质是明文传输的，所以这个过程是可以被人截获和窥探的，但是Bob不担心被人窥探， 他担心的是内容被人篡改或者有人冒充自己跟Susan通信。这里其实涉及到了计算机安全学中的认证概念， Bob要向Susan证明通信的对方是Bob本人，另外也需要确保自己的内容是完整的。

5、Susan接收到了Bob的信，首先用Bob给的公钥对签名作了解密处理，得到了哈希值A，然后Susan用 了同样的Hash算法对信的内容作了一次哈希处理，得到另外一个哈希值B，对比A和B，如果这两个值是相 同的，那么可以确认信就是Bob本人写的，并且内容没有被篡改过。
说明:4跟5其实构成了一次完整的通过数字签名进行认证的过程。数字签名的过程简述为:发送方通过不 可逆算法对内容text1进行处理(哈希)，得到的结果值hash1，然后用私钥加密hash1得到结果值encry1。 对方接收text1和encry1，用公钥解密encry1得到hash1，然后用text1进行同等的不可逆处理得到hash2，对 hash1和hash2进行对比即可认证发送方。

6、此时，另外一种比较复杂出现了，Bob是通过网络把公钥寄送给他的三个好朋友的，有一个不怀好意的 家伙Jerry截获了Bob给Doug的公钥。Jerry开始伪装成Bob跟Doug通信，Doug感觉通信的对象不像是 Bob，但是他又无法确认。

7、Bob最终发现了自己的公钥被Jerry截获了，他感觉自己的公钥通过网络传输给自己的小伙伴似乎也是不 安全的，不怀好意的家伙可以截获这个明文传输的公钥。为此他想到了去第三方权威机构“证书中心” (certificate authority，简称CA)做认证。证书中心用自己的私钥对Bob的公钥和其它信息做了一次加 密。这样Bob通过网络将数字证书传递给他的小伙伴后，小伙伴们先用CA给的公钥解密证书，这样就可以 安全获取Bob的公钥了。


## 进一步了解

1. [What is a Digital Signature?](http://www.youdzone.com/signature.html)