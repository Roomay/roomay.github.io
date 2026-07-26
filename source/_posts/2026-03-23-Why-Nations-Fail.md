---
title: Why Nations Fail
categories:
  - 读书杂记
tags:
  - 经济
  - 社会
  - 历史
  - by Daron Acemoglu & James A.Robinson
toc: true
date: 2026-03-23 23:24:06
updated: 2026-03-23 23:24:06
---

[//]: # "下一行开始到<!--more-->为引文部分，引文会显示在预览中"
这本书写得太好了，好到刚看了开头几章就忍不住要写笔记把感想记下来。
<!--more-->
<script id="__bs_script__">//<![CDATA[
    document.write("<script async src='http://HOST:3000/browser-sync/browser-sync-client.js?v=2.26.14'><\/script>".replace("HOST", location.hostname));
//]]></script>

[//]: # "下一行开始为正文"
# 主要观点

## 美洲南北大陆的制度沿革


# 疑问

## 尝试回答

<script>
  document.addEventListener("DOMContentLoaded", function() {
    const article = document.querySelector('.post-content, .article-entry, .markdown-body') || document.body;
    const headings = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let counts = [0, 0, 0, 0, 0, 0];
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.substring(1)) - 1;
      counts[level]++;
      
      // 清除所有更低层级的计数器
      for (let i = level + 1; i < 6; i++) { 
        counts[i] = 0; 
      }
      
      // 核心修改：只将大于 0 的层级加入序号，自动过滤跨级产生的 0
      let seqParts = [];
      for (let i = 0; i <= level; i++) {
        if (counts[i] > 0) {
          seqParts.push(counts[i]);
        }
      }
      
      // 拼接序号
      let seqStr = seqParts.join('.') + '.';
      
      if (seqStr !== '.' && !heading.querySelector('.heading-seq')) {
        const span = document.createElement('span');
        span.className = 'heading-seq';
        span.textContent = seqStr + '\u00A0\u00A0';
        const headerlink = heading.querySelector('.headerlink');
        if (headerlink) {
          heading.insertBefore(span, headerlink.nextSibling);
        } else {
          heading.insertBefore(span, heading.firstChild);
        }
      }
    });
  });
</script>
<style>
  .heading-seq { font-family: inherit; color: inherit; }
</style>