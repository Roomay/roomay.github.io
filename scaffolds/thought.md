---
title: {{ title }}
date: {{ date }}
updated: {{ date }}
categories:
    - 杂谈
tags: 
  - 经济
  - 人生规划
  - xx
toc: true

---

[//]: # "下一行开始到<!--more-->为引文部分，引文会显示在预览中"

<!--more-->
<script id="__bs_script__">//<![CDATA[
    document.write("<script async src='http://HOST:3000/browser-sync/browser-sync-client.js?v=2.26.14'><\/script>".replace("HOST", location.hostname));
//]]></script>

[//]: # "下一行开始为正文"
## 章节1

## 章节2

## 章节3

…………

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