---
title: git submodule 使用过程中遇到的问题
subtitle: 

# Summary for listings and search engines
summary: 如何正确使用 git submodule

# Link this post with a project
projects: []

# Date published
date: 2014-10-04T21:01:15Z

# Date updated
lastmod: 2014-10-04T22:01:15Z

# Is this an unpublished draft?
draft: false

# Show this page in the Featured widget?
featured: false

# Featured image
# Place an image named `featured.jpg/png` in this page's folder and customize its options here.
image:
  caption: 'git'
  focal_point: "Smart"
  placement: 1
  preview_only: false

authors:
- admin

tags:
- git
- git submodule

categories:
- Computer Science 
- SE. Software Engineering
---

## 添加 submodule

为仓库添加 `submodule` ⬇

```bash
$ git submodule add {repo-url} /local/repo/path
```

## git clone 带有 submodule 的工程

```bash
$ git clone {repo-url}
```

完成之后，submodule 的代码并没有一起 clone 到本地，查看工作区可以发现 `submodule` 的上下文内容。
 
- `.gitmodules` 存在，里面包含了 submodule 的 url 和 `{path/to/submodule-name}`
- `{path/to/submodule-name}` 存在，但是文件夹是空的
- `.git/config` 里没有submodule库的信息

```bash
$ git status
```

没有发现有更改的地方。

```bash
$ git submodule status
```

可以看到 submodule `hash`，前面带有 `-` 表示 submodule 还没有 `checkout`。

## 拉取 submodule

`git submodule init` 利用工作区 `.gitmodules` 的信息，在 `.git/config` 里建立了 `submodule` 索引 `submodule.$name.url`，通过如下命令可以看到 `submodule` 的索引。

```bash
cat .git/config
```

`git submodule update` 默认走的是 `git submodule update --checkout`，利用 `superproject` 里记录的 `hash` 来 `checkout` submodule，这里就有个坑了。

文档中是这么描述的。

> **checkout**
>     the commit recorded in the superproject will be checked out in the submodule on a detached HEAD.
>     If --force is specified, the submodule will be checked out (using git checkout --force if appropriate), even if the commit specified in the index of the containing repository already matches the commit checked out in the submodule.

`detached HEAD` 不属于任何一条 `tree`，如果之后忘记 `checkout` 到某条分支上的话，那之后所有 submodule 的 commit 都基于这个 `detached HEAD`，那么我们就不得不使用 `cherry-pick`，把基于 `detached HEAD` 提交的 commit 提交 pick 到已有的分支上。

并且当 `submodule` 的嵌套层级太深的话，一层层的去 submodule 进行 `init` 以及 `update` 显然是不可取的，所以可以通过递归的方式去执行命令，这样能够做到 clone 主库以及递归拉取所有 submodule。

```bash
git clone {path/to/repo-name} --recurse
```


## 修改 submodule

通常在实际项目中执行 `submodule update` 的流程如下所示。

1. 当 repo-A 目录下的 repo-B 为 submodule，在对其进行修改之后，查看此时的工作区状态。

```bash
$ git status

On branch master	
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)
  (commit or discard the untracked or modified content in submodules)

	modified:   repo-B (modified content, untracked content)

$ git diff

diff --git a/submodules/repo-B b/submodules/repo-B
--- a/submodules/repo-B
+++ b/submodules/repo-B
@@ -1 +1 @@
-Subproject commit b449370e24b331e97f6d74ca2862fcd4e3c5bd4e
+Subproject commit b449370e24b331e97f6d74ca2862fcd4e3c5bd4e-dirty
```

2. 发现 submodule 是 modified 并且工作目录 dirty，执行 submodule 提交修改。

```bash
$ cd submodules/repo-B
$ git stage *
$ git commit -am 'Update content'
$ git status

On branch master
Your branch is ahead of 'origin/master' by 1 commit.
  (use "git push" to publish your local commits)
nothing to commit, working directory clean
```

3. 回到主项目，查看状态输出，显示 submodule 的 `hash` 已更新。

```bash
$ git status

On branch master
Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   repo-B (new commits)
	
$ git diff

diff --git a/submodules/repo-B b/submodules/repo-B
--- a/submodules/repo-B
+++ b/submodules/repo-B
@@ -1 +1 @@
-Subproject commit b449370e24b331e97f6d74ca2862fcd4e3c5bd4e
+Subproject commit db560723ded8d1a0839dc08fb1e4324b30545c05
```

4. 主工程提交修改。

```bash
$ git stage *
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

	modified:   repo-B
	
$ git commit -am 'Update submodule' 
```

## 从远程库更新 submodule

当远程库的提交里记录的 submodule hash 有更新时，拉取远程库后，我们需要 update 本地的 submodule。git submodule update 会比较主项目记录的 submodule hash 和 submodule 自身当前的 HEAD hash，git 会强制把 submodule 的 HEAD checkout 到 git 记录的 hash，因为是 checkout 所以 detached HEAD 的问题会再一次出现。

```bash
$ git submodule update
Submodule path 'submodules/repo-B': checked out 'db560723ded8d1a0839dc08fb1e4324b30545c05'

$ cd submodules/repo-B
$ git log --decorate --all
commit 3b754aca54077269aedb328c6e738ab8a7ab3077 (master) # current submodule HEAD hash
Author: username <username@exmail.com>
Date:   Sat Dec 5 22:26:21 2015 +0800

    Modify _config.yml

commit db560723ded8d1a0839dc08fb1e4324b30545c05 (HEAD) # main project submodule hash
Author: username <username@exmail.com>
Date:   Sat Dec 5 21:46:40 2015 +0800

    Modify _config.yml, Add two image

commit b449370e24b331e97f6d74ca2862fcd4e3c5bd4e (origin/master, origin/HEAD)
Author: username <username@exmail.com>
Date:   Tue Dec 1 20:06:31 2015 +0800

    Modify _config.yml
    
$ git status
HEAD detached at db56072

$ git branch
* (HEAD detached at db56072)
  master
```

要从根本上摆脱 `detached HEAD` 的问题，使用 `rebase`、`merge` 是正确的方式。

- `git submodule update --rebase`
    the current branch of the submodule will be rebased onto the commit recorded in the superproject.

- `git submodule update --merge`
    the commit recorded in the superproject will be merged into the current branch in the submodule.

## 进一步了解

1. [git Documentation](https://git-scm.com/doc)