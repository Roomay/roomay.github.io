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
# 后端项目中连接池的应用

## 多个请求集中访问低性能服务器，如何限流
项目主要实现如下功能：用户在前端输入自己的「症状」，预期得到一个包含「推荐科室」、「初步诊断」的输出。这个输入到输出的运算经由一个 NLP-BERT 的 AI 模型处理，该 AI 模型部署在服务器 B 当中，而后端部署在服务器 A 当中（实际操作中，将两者布署在了同一服务器）。

用户 输入症状 -> 后端服务器 A -> 服务器 B 运行 NLP 脚本
        用户 <- 后端服务器 A <- 服务器 B 返回诊断

当有多个请求同时进入 NLP 服务器，服务器只有 4GB 内存，两个 CPU，性能不够而经常出现宕机无法响应的情况。为此需要将请求限流。实现时采用了**连接池**的方法。

### AI 服务器端

通过 server.listen(1)，我们将所用端口允许的最大连接数限制为 1。

```python
import socket
import os
import json
import random
import pandas as pd

os.environ['MKL_THREADING_LAYER'] = 'GNU'

def saveData(patient_id, data):
    # ... 省略若干无关代码

def runModel(patient_id):
    # ... 省略若干无关代码

def readResults(patient_id):
    # ... 省略若干无关代码

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
server.listen(1)                #  此处限制了最大连接数为 1，
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

### 后端

后端与 AI 服务器的通信会阻塞在 
sendMessageAndGetResultOfCasePrediction() 接口，当有多个请求调用此接口时，只有一个请求能成功连接，其他请求会暂时被阻塞。通过 Java 进程本身的调度，我们实现了对请求的简单限流。

```java
public class MedicalrecordController {

    // ... 省略若干配置代码


    /**
     * 根据姓名 + 年龄 + 症状表述
     * return 预测症状的可能的解决办法
     */
    @CrossOrigin
    @PostMapping("/medicalrecord/predictionCase")
    public ResultObject predictCase(int recordId) {
        try{
            MedicalRecord medicalRecord=medicalrecordService.selectByPrimaryKey(recordId);
            int patientId = medicalRecord.getPatientId();
            PatientInfo patient = patientService.findPatientById(patientId);
            String gender = "";
            Format formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String birthday = formatter.format(patient.getBirthday()).split("-")[0];
            String age = 2022 - Integer.parseInt(birthday) + "";
            String symptom = medicalRecord.getSymptom();
            if(medicalRecord.getGender().equals("0")) {
                gender = "女";
            } else {
                gender = "男";
            }
            String request = patientId + ";" + gender + "，" + age + "。" + symptom;
            String predictResult = clientService.sendMessageAndGetResultOfCasePrediction(request);    // 后端与 NLP 服务器的通信，当有多个请求调用此接口时，只有一个请求能成功连接，其他请求会暂时被阻塞。通过 Java 进程本身的调度，我们实现了对请求的简单限流。
            if(predictResult.equals("")) {
                return ResultObject.error("症状结果预测失败");
            }
            else {
                medicalRecord.setDiagnosis(predictResult);
                medicalRecord.setStatus(2);
                medicalrecordService.updateByPrimaryKeySelective(medicalRecord);

                return ResultObject.success(predictResult);
            }
        } catch (Exception e) {
            return ResultObject.error(Message.SERVER_ERROR);
        }
    }


public class ClientService {

    // ... 省略若干配置代码

    public String sendMessageAndGetResultOfCasePrediction(String s) {
        // s is the case, which is like “性别，年龄。症状”
        // for example: "女，10岁。高烧不退，还有经常性的咳嗽"
        Socket socket = null;
        String Code_Adress = "43.138.65.17"; // server ip address
        try {
            socket = new Socket(Code_Adress,9007); // 9007 is the case prediction port
            OutputStream outputStream = socket.getOutputStream();   
            InputStream inputStream = socket.getInputStream();
            byte[] bytes = new byte[1024];
            outputStream.write(s.getBytes());   // 向发送到 AI 服务器的输出流当中写入症状
            int len = inputStream.read(bytes);  // 从 AI 服务器 发来的输入流接受数据
            String result = new String(bytes,0,len);

            socket.close();
            //System.out.println(result);
            return result;
        } catch (IOException e) {
            e.printStackTrace();
        }

        return "";
    }
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