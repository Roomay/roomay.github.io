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
updated: 2022-09-06 23:48:44
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

### Kafka 架构
* Coordinator：为 Broker、Producer、Consumer 等组件注册服务
  * 较早版本为 Zookeeper，2.8 版本以后用内部 quorum 代替。
* Producer：生成消息流
  * 内部有一个个固定大小（可调）的 Batch 来作为缓冲区暂存消息，消息在满足 ACK 要求后会被完全删除。
* Broker：暂存消息，接受用户的调度
  * 以 Partition 为逻辑单位存储消息。一个 topic 被 hash 映射到多个 partition，这些 partition 可以放在不同 broker 上，内部有 offset 标记消息位置和顺序。
* Consumer：从 Broker 按照 topic 订阅消息，因此，一个 topic 映射的多个 partition 都会被同一个 consumer 消费。

* Topic：消息的组织单元，Consumer 按照 topic 订阅消息。
* Partition：topic 中的消息实际的组织形式，将 topic 中的消息 hash 到不同的 partition 当中。
  一个 Broker 当中可以有不同的 partition，分属于不同的 topic，每一个
* Record：消息的格式，Key + Value + 时间戳，Key 用作 hash 映射到 partiton，value 就是我们需要的消息。

## RocketMQ 的工作原理
之前做的项目里用到过 Kafka，因此从 Kafka 入手，尝试快速上手理解一下 RocketMQ 的原理和使用，也顺便做一下两者的对比。
### RocketMQ 架构

* NameServer 集群：管理元数据，包括 Topic 路由信息等（类似 Kafka 的 Coordinator 角色），接受 Broker 集群的服务注册。发现 Producer 集群和 Consumer 集群的服务。
* Producer 集群：向 Broker 集群发送消息
* Consumer 集群：从 Broker 集群消费消息
* Broker 集群：Master-Slave 架构，存储消息

* Topic：与 Kakfa 的类似，Consumer 订阅 topic 中的消息。
* Shards：与 Parttion 类似的概念，Topic 会根据 sharding key 被 hash 到不同的 shards 当中。
* Queue：与Partition 的概念类似，消息生产/消费都是在 Queue 中逻辑寻址。
不同的是，

## Hadoop, Spark, Kafka 等系统如何处理分布式场景下的数据一致性？
### Hadoop 如何保证数据一致
Hadoop 严格来讲不是分布式系统，只是将计算任务分配到各个节点 DATa Node 当中，不同节点由 NameNode 调度，而彼此之间是相互独立的，不会出现并发错误下的一致性问题。

### Kafka 如何保证消息不出错
Kafka 有其 ACK 确认机制和协同机制，主要发生在 Broker 和 Producer 之间。
* Replicas 备份机制：同一个 Partition 在物理上有多个备份 Replicas（可能存放在不同 Broker 上），备份数可以在参数里调整。一组 Replicas 当中会有一个作为 leader，其余作为 follower 同步 leader 的内容作为备份。
* Acknowledgement 确认机制：Producer 向 Broker 发送消息时会等待 Broker 确认（ACK），根据 ACK 参数的设置进行不同的响应。
  * ACK = 0：Producer 无须等待 Broker 的确认，持续发送消息。
  * ACK = 1：只要收到 leader replica 确认，Producer 就继续发送消息。
  * ACK = -1：需要 partition 的所有 replicas 确认，Producer 才能继续发送消息。
* Sync 协同机制：Broker 中 replicas 的状态，leader 会周期性检查 follower 是否在线，在线/不在线的标记为 in-Sync / Out-of-Sync。当标记为 in-Sync 的 replicas 数量小于设定的参数时，Producer 会停止发送。


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