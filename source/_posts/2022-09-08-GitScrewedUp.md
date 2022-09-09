---
title: Git 踩坑日记
categories:
  - 工作踩坑
tags:
  - 工作
  - 后端
toc: true
date: 2022-09-08 10:35:09
updated: 2022-09-08 10:35:09
---

[//]: # "下一行开始到<!--more-->为引文部分，引文会显示在预览中"
工作中用 Git 踩到的一些坑，尤以分支管理混乱为多，记录以备复盘。
<!--more-->
<script id="__bs_script__">//<![CDATA[
    document.write("<script async src='http://HOST:3000/browser-sync/browser-sync-client.js?v=2.26.14'><\/script>".replace("HOST", location.hostname));
//]]></script>

[//]: # "下一行开始为正文"
# Git 踩坑日记

## 本地分支落后于远端
本地和远端各有两组相对应的分支：
  * deploy-test -> origin deploy-test
  * feature     -> origin feature

feature 是功能分支，当我要维护一个功能，会从 master 分出一份干净的代码，在本地修改后创建一个功能分支，修改后推送到远端。

deploy-test 分支是测试分支，代码比较脏，组内各个功能在测试都会推送上去，本地分支常常落后于远端。

deploy-test 需要在本地 merge 操作合并某个开发完的 feature 分支，再 push 到远端。并且为了保持本地代码的整洁，不会从远端的 origin deploy-test pull 代码。

本地 deploy-test 合并完成 feature 相关代码后，进行 push 时，由于在这期间远端有其他用户进行了修改，本地分支落后于远端数个版本，会导致 push 不成功，报错。

可以先将当前 deploy-test 分支的 rebase 和 merge abort，之后再 reset -hard 远端分支，使得

<style type="text/css">
    h1 { counter-reset: h2counter; }
    h2 { counter-reset: h3counter; }
    h3 { counter-reset: h4counter; }
    h4 { counter-reset: h5counter; }
    h5 { counter-reset: h6counter; }
    h6 { }
    h2:before {
      counter-increment: h2counter;
      content: counter(h2counter) ".\0000a0\0000a0";
    }
    h3:before {
      counter-increment: h3counter;
      content: counter(h2counter) "."
                counter(h3counter) ".\0000a0\0000a0";
    }
    h4:before {
      counter-increment: h4counter;
      content: counter(h2counter) "."
                counter(h3counter) "."
                counter(h4counter) ".\0000a0\0000a0";
    }
    h5:before {
      counter-increment: h5counter;
      content: counter(h2counter) "."
                counter(h3counter) "."
                counter(h4counter) "."
                counter(h5counter) ".\0000a0\0000a0";
    }
    h6:before {
      counter-increment: h6counter;
      content: counter(h2counter) "."
                counter(h3counter) "."
                counter(h4counter) "."
                counter(h5counter) "."
                counter(h6counter) ".\0000a0\0000a0";
    }
</style>