---
title: 用 Hexo 搭建个人博客
subtitle: 用 Hexo 搭建个人博客的基本流程
summary: 用 Hexo 搭建个人博客的基本流程
projects: []
date: 2014-06-12T00:00:00.000Z
lastmod: 2014-06-12T00:00:00.000Z
draft: false
featured: false
image:
  caption: Hexo
  focal_point: Smart
  placement: 2
  preview_only: false
authors:
- admin
cip_code: '11.0701'
tags:
- Web Template System
- Hexo
- Hugo
categories:
- PBD. Platform-Based Development
cips:
- 11.07) Computer Science
- 11.0701) Computer Science
---

今次通过 Hexo 生成静态博客网站，所以配置服务器的流程可以省去，直接托管在 Github Pages 上即可，这也目前轻量级博客的趋势。


## 环境安装

### Node 环境安装

#### 安装 [NVM](https://github.com/creationix/nvm) 

在终端中运行如下命令。
```bash
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash
```


#### 安装 [Node.js](https://nodejs.org/en/)

使用如下命令查找远程库版本。
```bash
$ nvm ls-remote 
```

找到合适的版本并安装。
```bash
$ nvm install 5.1.0
```


### 安装 [Hexo](https://hexo.io)

Hexo 有丰富的[插件](https://hexo.io/plugins/)和[主题](https://hexo.io/themes/)，如果不能满足需求的话还可以[自己动手](https://hexo.io/api/)，使用如下命令全局安装 `hexo-cli`。

```bash
$ npm install hexo-cli -g
```

安装 Hexo 所需的依赖包。
```bash
$ npm install hexo-renderer-ejs --save
$ npm install hexo-renderer-stylus --save
$ npm install hexo-renderer-marked --save
```

或者直接通过 `package.json` 一步到位。
```bash
$ npm intall
```


## 添加文章 Posts

找个文件夹初始化 Blog 的工作目录。
```bash
$ cd "/path/to/blog"
$ hexo init 
```

生成一篇文章。

```bash
$ hexo new "用 Hexo 搭建个人博客"
```

使用 `vim` 或者其他 `Markdown Editor` 编辑文章。

```bash
$ cd source/_posts
$ vim 用-Hexo-搭建个人博客.md
```

**附上 `Markdown` [语法](https://daringfireball.net/projects/markdown/syntax)**。写完博文之后生成 `html`、`css`、`.js` 等静态网页文件，生成之后的内容在博客根目录 `public` 文件夹下，里面就是博客需要部署的内容。

```bash
$ hexo generate
```

启动本地 Hexo 服务器。

```bash
$ hexo server
INFO Hexo is running at http://0.0.0.0:4000/. Press Ctrl+C to stop.
```

在浏览器内输入[本地服务器地址](http:localhost:4000/)预览博客。


## 部署至 Github

部署到 Github 上用于 Github Pages 的 repo 有两种形式：

1. 主页级 repo，页面部署到 `master` 分支下，访问 Github Pages 时使用 `username.github.io`，常用于个人主页。
2. 项目级 repo，页面部署到 `gh-pages` 分支，访问 Github Pages 时使用 `username.github.io/repo-name`，常用于项目主页。

在 _config.yml 内配置完部署信息后 (`deploy` 字段) 执行如下命令。

```
$ hexo clean
$ hexo generate
$ hexo deploy
```

或者使用如下命令。
```
$ hexo g
$ hexo d
```

完成部署至 Github，过个几分钟等 Github 更新完缓存再打开 `{username}.github.io/{blog-repo}` 或者 `{username}.github.io` 就能看到 Github Pages。


## 绑定域名

Github 使用一系列 **name-based** 虚拟 `WWW` server 部署所有静态博客的 wwwroot 目录。虚拟服务器的地址就是上文提及的 `{username}.github.io` 和 `{username}.github.io/{repo-name}`，因此将需要绑定的域名指向 Github 的服务器 https://github.io，把域名解析权下放到 Github。

同时 Github 服务器需要知道如何解析域名，所以 Github Pages 用户需要将绑定的域名通过 wwwroot 目录下的 CNAME 文件告知 WWW server 域名 => `repo/branch` 的映射关系，所以在根目录 source 文件夹下建立一个 CNAME 文本文件，内容为绑定的域名。

完成之后，输入命令查询下 dns 解析结果。

```bash
$ dig blog.alchemistxxd.com

; <<>> DiG 9.8.3-P1 <<>> blog.alchemistxxd.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 45658
;; flags: qr rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;blog.alchemistxxd.com.  IN  A

;; ANSWER SECTION:
blog.alchemistxxd.com.  600  IN  CNAME  alchemistxxd.github.io.
alchemistxxd.github.io.  2816  IN  CNAME  github.map.fastly.net.
github.map.fastly.net.  142  IN  A  103.245.222.133

;; Query time: 299 msec
;; SERVER: 222.44.10.48#53(222.44.10.48)
;; WHEN: Wed Dec  2 23:41:45 2015
;; MSG SIZE  rcvd: 126
```

终わり


## 进一步了解

1. [Github Pages](https://pages.github.com/)
2. [Hexo.io](https://hexo.io/)
3. [Hexo Documentation](https://hexo.io/docs/)
3. [npm Docs](https://docs.npmjs.com/)