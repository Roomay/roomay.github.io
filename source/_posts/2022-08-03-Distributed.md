---
title: 分布式系统、消息中间件相关
categories:
  - 面经热身
tags:
  - 八股文
  - 后端
  - 面经
toc: true
date: 2022-08-03 10:19:26
updated: 2022-08-18 21:41:42
---

[//]: # "下一行开始到<!--more-->为引文部分，引文会显示在预览中"
使用 Hadoop、Spark、Kafka、RocketMQ 等分布式组件、消息组件时涉及到的问题。
<!--more-->
<script id="__bs_script__">//<![CDATA[
    document.write("<script async src='http://HOST:3000/browser-sync/browser-sync-client.js?v=2.26.14'><\/script>".replace("HOST", location.hostname));
//]]></script>

[//]: # "下一行开始为正文"
# 分布式系统、消息中间件相关

## Kubernutes（K8s） 的工作原理，配置管理虚拟容器集群的优点
K8s 是一种虚拟机管理程序，适用于布署和管理分布式虚拟机集群（Cluster）。
K8s 的虚拟机更加适配于容器化管理，在操作系统层次上布署一层容器运行时 Container Runtime 服务来提供容器运行的环境，比如可以选择 Docker 作为 Container Runtime。Container Runtime 上可以运行多个 K8s 最小管理单元 Pods。
K8s 采用 Namespaces 机制实现对资源的隔离、分组。 在系统目录下创建不同的 Namespace，不同 Namespace 彼此相独立隔绝，拥有只有自己可见的资源结构，包括硬件资源如 CPU、内存、页块大小，软件资源如进程树、文件目录等。Namespace 可以用 YAML 文件配置。
K8s 的 Label 功能，可以给 K8s 对象（Nodes、Pods 等）绑定若干个键值对 Key-Value Pairs，方便进行管理。
K8s 的结构跟大多数分布式系统一样，采用 Master-Slave 主从结构：
* Master 节点
  - 运行有 API Server，负责管理和调度 各 Node 节点（和节点上布署的 Pods）。
  - 运行有守护线程 controller manager，管理各种 controller。
*  Node 节点
  - 每个节点运行有一个节点服务 Kubelet，负责将该节点对应的 hostname （或者以其他标识）注册到 API Server。在 API Server 中用 YAML 或者 JSON 文件定义一个名为 PodSpec 的对象，该对象在 Kubelet 中实例化，用以描述在节点中运行的 Pod 参数。
  - 每个节点运行有一个节点服务 Kube proxy，负责转发 API Server 中定义的后端服务到本地节点，诸如 TCP、UDP、SCTP，以及 IP 地址和端口等。proxy 本身也需要在 API Server 中配置。
采用 K8s 的优点：K8s 通过 YAML、JSON 等文件可以进行对分布式虚拟机集群进行批量配置（如配置 PodSpec，配置 Namespace），并在 API Server 中提供 replication controller、endpoints controller、namespace controller、serviceaccounts controller 等 API （由 controller manager 维护）进行控制管理。

## Hadoop，Spark 的工作原理，二者有何异同

## Kafka 的工作原理
Kafka 是一种 Real-time Structured Streaming Applications 实时结构化数据流应用，主要实现原理是「生产者-消费者」的消息队列模型。

## RocketMQ 的工作原理
### 架构
* NameServer 集群：管理元数据，包括 Topic 路由信息等（类似 Kafka 较早版本的 Zookeeper），接受 Broker 集群的服务注册。发现 Producer 集群和 Consumer 集群的服务。
* Producer 集群：向 Broker 集群发送消息
* Consumer 集群：从 Broker 集群消费消息
* Broker 集群：Master-Slave 架构，存储消息

## Hadoop, Spark, Kafka 等系统如何处理分布式场景下的数据一致性？
* Hadoop 严格来讲不是分布式系统，只是将计算任务分配到各个节点 DATa Node 当中，不同节点由 NameNode 调度，而彼此之间是相互独立的，不会出现并发错误下的一致性问题。
* Kafka 的 Ack 机制

## 云计算相关

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