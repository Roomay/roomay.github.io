---
title: Flexport 面试
categories:
  - 面经
tags:
  - 后端
  - 面经
  - 算法
toc: true
date: 2022-08-17 18:00:40
updated: 2022-08-17 18:00:40
---

[//]: # "下一行开始到<!--more-->为引文部分，引文会显示在预览中"
Flexport 的风格跟大多数外企一样，主要考察做题。
<!--more-->

<script id="__bs_script__">//<![CDATA[
    document.write("<script async src='http://HOST:3000/browser-sync/browser-sync-client.js?v=2.26.14'><\/script>".replace("HOST", location.hostname));
//]]></script>


[//]: # "下一行开始为正文"

# 一面
考察了两道算法题（第二道当场没想出来，不确定后续是否还有其他题），题本身不难，可能自己有点钻牛角尖没做出第二问。在这里记录以供复盘。
## 随机字符串生成
* 输入：
  一个字符串 input，是一个由单词和空格组成的句子（无前导空格，无标点，单词之间仅以一个空格间隔，字符全是小写英文字母），以及一个整数 N 表示生成句子的单词个数。
* 输出：
  一个字符串 output，包含 N 个单词，这 N 个单词按照如下规则生成：在 input 句子中随机取一个单词，作为输出句子中的第一个单词，记为 word_1，（word_1 在句子中可能重复出现）。每一个 word_1 之后紧跟着的下一个单词，组成一个单词池，在这个池中继续随机抽取一个单词，作为句子的第二个单词，记为 word_2，…… 以此类推，直到句子有 N 个单词为止。
  如果某一步取到了 input 句子的最后一个单词，则下一个单词应该为 input 的第一个单词，即 input 可以视为一个字符串循环队列，各元素之间以空格分开，最终拼接而成。
  因为单词每次都是随机抽取的，所以对于同一个用例，每次调用的输出结果可能不同。
  抽取单词考虑权重，即单词被抽到的概率与其在合法的结果中出现的概率成正比。
* 样例输入：
  input = "it is a good sentence but is also a bad one"
  N = 5
样例输出：
  output = "is a good sentence but"
  output = "is a bad one it"
  output = "is also a good sentence"
  output = "is also a bad one"
  output = "sentence but it is a"
  以上任意一条输出都是正确答案，由于开头的单词是随机取的，因此答案不限于上面这些。
解释：
  第 1 个单词在所有单词中抽取，随机取到 "is"（注意 "is"、"a" 出现了 2 次，抽到的概率是其他单词的 2 倍）；"is" 在句中出现 2 次 "is a" 和 "is also"，这两个都可以作为备选结果，随机选择其中一个作为第 2 个单词，比如 "a"；"a" 之后又有 "good" 和 "bad" 两种情况，随机选择一个作为第 3 个单词，比如 "good"；"good" 之后是 "sentence"，再之后是 "but"，分别作为第 4 和第 5 个单词，然后输出。
  其他答案同理。
### 思路：
  这题很明显可以用哈希表来做，key 为每一个单词，value 可以是一个 List\<String\>，存放该单词后面所有可能的单词（因为可能有重复元素，Set 并不适用，并且考虑权重，可以直接生成随机数然后按下标抽取）。
  第一次在所有单词中抽取单词作为 key，获得对应可能的下一个单词列表 List；在 List 中再抽取一个单词，作为新的 key，迭代访问该哈希表，直到抽取出 N 个单词，即可输出。
  细节方面，开始的字符串数组构建可以用 split() 方法，输入的正则表达式为 "\\\\s" 空格，将句子分割为一个字符串数组 Stirng\[\]。生成的字符串可以用 List\<String\> 构建，最后再用 String.join() 方法生成。
时间复杂度：O(n + N)，n 是 input 中包含的单词个数，因为需要遍历 n 个单词构建哈希表； N 是要求输出的 output 中包含的单词个数，因为需要迭代 N 轮，每一轮进行一次 O(1) 的查询和抽取。
空间复杂度：O(n)，哈希表中有 n 个作为 key 的单词，并且所有单词对应的 value 单词列表规模之和不会超过 n（仅当无重复单词时为 n），因为一共遍历 n 个单词。
### 实现：
``` java
    public String solute(String input, int N) {
        // Init
        List<String> arr = Arrays.asList(input.trim().split("\\s+"));
        int len = arr.size();
        Map<String, List<String>> map = new HashMap<>();

        for (int i = 0; i < len; i++) {
            String key = arr.get(i);
            if (!map.containsKey(key)) {
                map.put(key, new ArrayList<String>());
            }
            List<String> next = map.get(key);
            next.add(arr.get((i + 1) % len));
        }

        // Result Build
        List<String> res = new ArrayList<>(N);

        // Randomly get first word
        Random ran = new Random();
        List<String> itrList = arr;

        // Iteration
        for (int i = 0; i < N; i++) {
            int index = ran.nextInt(itrList.size());
            String itr = itrList.get(index);
            res.add(itr);
            itrList = map.get(itr);
        }
        return String.join(" ", res);
    }
```
## 变式
* 输入：
  一个字符串 input，以及一个整数 N，作用与之前一样。
  另外还有一个整数 M（M \< N）表示一个词组包含的单词个数。抽取新单词时，新单词应该位于当前倒数 M 个单词组成的词组之后。
* 输出：
  一个字符串 output，包含 N 个单词，这 N 个单词按照如下规则生成：在 input 句子中随机抽取一个由 M 个连续单词组成的词组，作为输出句子中的第 1 到第 M 个单词，并在 input 中匹配该词组，将每一次词组出现之后紧跟着的下一个单词，加入到一个待选的单词池中，在这个池中继续随机抽取一个单词，作为句子的下一个单词，此时结果中含有 M + 1 个单词。于是我们接着将第 2 到 第 M + 1 个单词组成的词组视为整体，继续在 input 中进行匹配，…… 以此类推，直到句子有 N 个单词为止。
  input 仍可以视为一个字符串循环队列，各元素之间以空格分开，最终拼接而成。
  因为单词每次都是随机抽取的，所以对于同一个用例，每次调用的输出结果可能不同。
  抽取单词考虑权重，即单词被抽到的概率与其在合法的结果中出现的概率成正比。
* 样例输入：
  input = "it is a good sentence but it is also a bad one"
  N = 5
  M = 2
样例输出：
  output = "it is a good sentence"
  output = "it is also a bad"
  如果一开始抽到 "it is"，则只有以上输出的其中任意一条是正确答案。
解释：
  前 2 个单词在所有单词中抽取，随机取到 "it is"（注意 "it is" 出现了 2 次，抽到的概率是其他单词的 2 倍）；其后出现了 "a" 和 "also"，这两个都可以作为备选结果，随机选择其中一个作为第 3 个单词，比如 "a"；现在第 2 到第 3 个单词组成的词组为 "is a"，之后只有 "good"，作为第 4 个单词；再之后是 "a good"，下一个单词为 "sentence"，作为第 5 个单词，然后输出。
  其他答案同理。
  前一题可以视为本题 M = 1 的特殊情况
### 思路：
  观察可以发现，不论 M 多大，考虑词组开头的第一个单词，依然是分解后的字符串数组中的任意一个单词，M 只不过是增加了匹配的精度，限定了可选的范围。
  因此思路仍然是哈希表不变，key 仍是字符串，只不过这个字符串是一个由 M 个单词组成的词组（含间隔空格，以排除不同单词恰好拼接成同样字符串的情况）。后续的抽取方式同前一题。
时间复杂度：O(nM + N)，n 是 input 中包含的单词个数，因为需要遍历 n 个单词，每次构建一个规模为 M 个单词的字符串，形成哈希表的 key； N 是要求输出的 output 中包含的单词个数，因为需要迭代 N - M + 1 轮，每一轮进行一次 O(1) 的查询和抽取。
空间复杂度：O(nM)，哈希表中有 n 个作为 key 的长度为 M 个单词的词组，并且所有单词对应的 value 单词列表规模之和不会超过 n（仅当无重复单词时为 n），因为一共遍历 n 个单词。
### 实现：
```java
    public String solute(String input, int N, int M) {
        // Init
        List<String> arr = Arrays.asList(input.trim().split("\\s+"));
        int len = arr.size();
        Map<String, List<String>> map = new HashMap<>();

        // Build Keys
        List<String> keySB = new LinkedList<>();
        for (int i = 0; i < M - 1; i++) {
            keySB.add(arr.get(i));
        }

        // Keys and List of Next words
        for (int i = 0; i < len; i++) {
            keySB.add(arr.get((i + M - 1) % len));
            String key = String.join(" ", keySB);
            if (!map.containsKey(key)) {
                map.put(key, new ArrayList<String>());
            }
            List<String>next = map.get(key);
            next.add(arr.get((i + M) % len));
            keySB.remove(0);
        }

        // Result Build
        List<String> res = new LinkedList<>();

        // Random get first index and the initial phrase
        Random ran = new Random();
        int index = ran.nextInt(len);
        List<String> itrSB = new LinkedList<>();

        for (int i = 0; i < M; i++) {
            String cur = arr.get((i + index) % len);
            itrSB.add(cur);
            res.add(cur);
        }

        // Iteration
        for (int i = M; i < N; i++) {
            String itrKey = String.join(" ", itrSB);
            List<String> itrList = map.get(itrKey);

            index = ran.nextInt(itrList.size());
            String nextWord = itrList.get(index);

            res.add(nextWord);
            itrSB.add(nextWord);
            itrSB.remove(0);
        }
        return String.join(" ", res);
    }
```

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