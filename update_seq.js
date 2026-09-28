const fs = require('fs');
const path = require('path');

// Hexo 默认的文章存放目录
const postsDir = path.join(__dirname, 'source', '_posts'); 

// 匹配最早的纯 CSS 代码
const regexCSS = /<style type="text\/css">[\s\S]*?h1\s*\{\s*counter-reset:\s*h2counter;\s*\}[\s\S]*?<\/style>/g;
// 匹配上一版旧 JS 代码 (通过特征词 hasStarted 识别)
const regexJS = /<script>[\s\S]*?counts\[i\] > 0 \|\| hasStarted[\s\S]*?<\/style>/g;

// 最新版完美兼容跨级标题的代码
const newCode = `<script>
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
        span.textContent = seqStr + '\\u00A0\\u00A0';
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
</style>`;

// 遍历目录
function walkDir(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`❌ 找不到目录: ${dir}`);
    return;
  }
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.md')) {
      processFile(fullPath);
    }
  }
}

// 处理替换
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  let updated = false;
  if (regexCSS.test(newContent)) {
    newContent = newContent.replace(regexCSS, newCode);
    updated = true;
  }
  if (regexJS.test(newContent)) {
    newContent = newContent.replace(regexJS, newCode);
    updated = true;
  }
  
  if (updated) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ 成功更新: ${filePath}`);
  }
}

console.log("🚀 开始扫描并替换文件...");
walkDir(postsDir);
console.log("🎉 全部替换完成！");