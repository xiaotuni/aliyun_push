# 阿里云推送

* 由于之前的项目推送是用JAVA写的，后来由于人员走动就现在有的人员对JAVA不是很了解， 所以就用NODEJS写推送了。
* 框架用的KOA+MongoDB+MySQL+Redis里面的一些功能去掉了，但是核心部分是可以正常使用的。

* MySQL用来存储发送推送记录的数据
* MongoDB主要是用来存放阿里云那边的数据的，阿里云里面的一些数据保留的时候还是有限制。

## 配置文本
```
  ./server/config/ 目录下。
  由于生产环境、测试、开发环境不同，所以将一些配置信息分别保存到不同的文件里。
```

# !注意
 
  阿里推送要几个参数：访问阿里云的 ***key及sercet*** 。在 ***./server/config/*** 下的 cfg.XXX.js里 
  有的接口要传入AppKey，这个是用来判断应用是iOS还是Android。我的项目里是传入进去的。如果在阿里去上配置了好几个应用的话，传进去方便些。
-------
## 项目结构：
```
- serve
  - app.js -----------------------> 项目的入口类
  - api --------------------------> 接口
    - routers ----------------------> 具体什么接口
  - common -----------------------> 常用的工具类
    - CheckInfo---------------------> 主要是用来请求数据验证（虽然koa-validate也可以进行对数据验证处理，总感觉不是很方便）。
    - FileHelper--------------------> 一个读写JSON文件。
    - HttpHelper--------------------> 调用接口用
    - Utility-----------------------> 常用的工具类
  - config -----------------------> 配置文件
  - database ---------------------> 连接数据用的
  - middeleware ------------------> 主要用于redis 权限判断
  - model ------------------------> 数据表的model
  - service ----------------------> 业务操作
    - AliYunService ----------------> 用于实现阿里云接口的类。
    - BaseService ------------------> 封装MongoDB 表中一些常用的方法，增删改查等。
    - CommParamService--------------> 阿里云接口参数拼接，生成签名类。
    - RedisClientService -----------> 连接Reids的类
```


## 接口调用
```
http://127.0.0.1:4100/app_push/api/aliyun/sendPush

post 方法
参数：

{
	"AppKey":"AppKey",
	"Target":"DEVICE",
	"TargetValue":"842c7a4cd3314b9c941e8de841ba7dff",
	"DeviceType":"ANDROID",
	"PushType":"NOTICE",
	"Title":"测试消息MESSAGE",
	"Body":"测试MESSAGE---MESSAGE"
}
```