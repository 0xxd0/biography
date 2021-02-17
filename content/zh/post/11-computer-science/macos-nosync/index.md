---
title: 如何在 iCloud 中屏蔽不需要同步的文件
subtitle: 通过文件名屏蔽 iCloud 同步

# Summary for listings and search engines
summary: 通过文件名屏蔽 iCloud 同步

# Link this post with a project
projects: []

# Date published
date: 2017-01-11T00:00:00Z

# Date updated
lastmod: 2017-1-12T00:00:00Z

# Is this an unpublished draft?
draft: false

# Show this page in the Featured widget?
featured: false

# Featured image
# Place an image named featured.jpg/png in this page's folder and customize its options here.
image:
  caption: ''
  focal_point: ""
  placement: 2
  preview_only: false

authors:
- admin

tags:
- macOS
- iCloud

categories:
- Computer Science 
- OS. Operation System
---

##### 文件名

- 是 .DS_Store
- 以 (A Document Being Saved 开头
- 包含 .nosync（大小写不敏感）
- 是 .ubd
- 包含 .weakpkg
- 是 tmp（大小写不敏感）
- 是 .tmp（大小写不敏感）
- 是 desktop.ini（大小写不敏感）
- 以 ~$ 开头
- 是 Microsoft User Data（大小写不敏感）
- 是 $RECYCLE.BIN（大小写不敏感）
- 是 iPhoto Library（大小写不敏感）
- 是 Dropbox（大小写不敏感）
- 是 OneDrive（大小写不敏感）
- 是 IDrive-Sync（大小写不敏感）
- 是 .dropbox（大小写不敏感）
- 是 .dropbox.attr（大小写不敏感）

##### 文件的扩展名

- 是 .tmp
- 是 .photoslibrary
- 是 .photolibrary
- 是 .aplibrary
- 是 .migratedaplibrary
- 是 .migratedphotolibrary


## 进一步了解

1. [How to exclude a sub folder from iCloud drive in macOS Sierra?](https://apple.stackexchange.com/questions/254313/how-to-exclude-a-sub-folder-from-icloud-drive-in-macos-sierra)