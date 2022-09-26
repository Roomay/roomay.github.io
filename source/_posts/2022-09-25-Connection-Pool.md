---
title: 后端项目中连接池的应用
categories:
  - 面经热身
tags:
  - 项目
  - 后端
  - 面经
  - 连接池
toc: true
date: 2022-09-25 13:17:19
updated: 2022-09-25 13:17:19
---

[//]: # "下一行开始到<!--more-->为引文部分，引文会显示在预览中"
在医疗管理系统中，为了缓解服务器压力，引入了连接池的组件来管理连接。
<!--more-->
<script id="__bs_script__">//<![CDATA[
    document.write("<script async src='http://HOST:3000/browser-sync/browser-sync-client.js?v=2.26.14'><\/script>".replace("HOST", location.hostname));
//]]></script>

[//]: # "下一行开始为正文"
# 主题

## 具体问题

```python
import socket
import os
import json
import random
import pandas as pd

os.environ['MKL_THREADING_LAYER'] = 'GNU'

def saveData(patient_id, data):
    df = pd.DataFrame(columns=['data'])
    df.loc[0] = [data]
    df.to_csv("data/test_" + patient_id + ".csv", index=False)

def runModel(patient_id):
    os.system('python run_classifier_multi.py \
      --task_name=sim \
      --do_predict=true \
      --data_dir=./data/ \
      --vocab_file=./chinese_L-12_H-768_A-12/vocab.txt \
      --patient_id=' + patient_id + ' \
      --bert_config_file=./chinese_L-12_H-768_A-12/bert_config.json \
      --init_checkpoint=./sim_model/ \
      --max_seq_length=128 \
      --output_dir=./output/'
      )

def readResults(patient_id):
    f = open("output/test_results_" + patient_id + ".tsv",encoding = "utf-8")
    input = f.readline()
    output = f.readline()
    return output[12:]

# 在构建socket的时候需要用到ip和端口，必须是元组的形式。
# 另外，因为是本机上的两个程序通信，所以设置成localhost，
# 如果要和网络上的其他主机进行通信，则填上相应主机的ip地
# 址，端口的话随便设置一个，不要和已知的一些服务冲突就行
address = ('0.0.0.0', 9008)
# 创建socket对象，同时设置通信模式，AF_INET代表IPv4，SOCK_STREAM代表流式socket，使用的是tcp协议
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# 绑定到我们刚刚设置的ip和端口元组，代表我们的服务运行在本机的9999端口上
server.bind(address)
# 开始监听，1为最大挂起的连接数
server.listen(1)
# 无限循环，实现反复接收请求
while True:
  # accept()方法被动接受客户端连接，阻塞，等待连接. client是客户端的socket对象，可以实现消息的接收和发送，addr表示客户端的地址
    sock, addr = server.accept()
    recv_data = sock.recv(1024).decode('UTF-8', 'ignore').strip()
    if recv_data:
        print('receiving: ' + ' addr: ' + str(address) + ' msg: ' + recv_data)

        if ';' not in recv_data:
            sock.send('wrong parameters, please use the correct format'.encode('utf-8'))
            sock.close()
            continue
        patient_id = recv_data.split(';')[0]
        patient_case = recv_data.split(';')[1]

        saveData(patient_id, patient_case)
        runModel(patient_id)
        result = readResults(patient_id)

        print("sending back: " + ' addr: ' + str(address) + ' msg: ' + result)
        sock.send(result.encode("utf-8"))
    else:
        break
    sock.close()
server.close()
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