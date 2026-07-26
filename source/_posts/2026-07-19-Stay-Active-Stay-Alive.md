---
title: Stay Active, Stay Alive
categories:
  - 杂谈
tags:
  - 经济
  - 人生规划
  - xx
toc: true
date: 2026-07-19 23:53:52
updated: 2026-07-19 23:53:52
---

[//]: # "下一行开始到<!--more-->为引文部分，引文会显示在预览中"

<!--more-->
<script id="__bs_script__">//<![CDATA[
    document.write("<script async src='http://HOST:3000/browser-sync/browser-sync-client.js?v=2.26.14'><\/script>".replace("HOST", location.hostname));
//]]></script>

[//]: # "下一行开始为正文"
## 生命脆弱

近来惊闻ZCR跳楼的消息，总给我一种这个世界不真实的感觉。我跟她交集很少，只是零星听闻人在世界银行工作——曾经我暗自盘算如果有天在银行干不下去了，就收拾行装去投世界银行的简历，满世界做公益项目，算是我的 Dream Job——但就是这样一个不错的履历，再加上印象里此人还算开朗的性格，却选择了如此激烈的方式与世界告别。

其实一直以来我也在思考一些很终极的问题：

* 比如到底是什么支撑一个人真正「活」在这个世界上，而非像行尸走肉一般浑浑噩噩地混日子？
* 又比如

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