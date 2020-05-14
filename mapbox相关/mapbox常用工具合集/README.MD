# MAPBOX 离线搭建教程
此教程主要是作者亲测，用来离线搭建mapbox本地地图服务器的。

本教程安装系统环境为 centos7 + win7；由于部分技术文档和下载连接在国外，需要点手段，否则访问卡慢或者无法访问，你懂得。
## 软件版本：
linux(centos 7+)服务器需要安装：
1. node v10.17.0 
2. docker
3. maputnik (mapbox的 style.json 样式制作软件，有Win+MAC+Linux三种版本，这里用的是linux版本)

win7安装软件：
1. MapTiler Desktop
2. bigemap地图下载器(类似的国产软件都可以)

`以下为可能会用到的（可以不安装），都是一些专业的地图处理工具：`

1. ArcMap
2. QGIS
3. global mapper


## 安装前期软件(可以不安装)：

在正式安装前期，作者安装了一些辅助软件，具体因人而异，根据个人习惯就好：

1. 宝塔
宝塔是一款linux系统的维护管理工具：相当于给mini版本的linux系统安装上了桌面的感觉，具体安装请查阅官网。`https://www.bt.cn/`

主要用宝塔安装了以下软件：
1. pm2：安装中自动安装了node，还可以选择node的版本。pm2是一个node服务器，很好用。
2. docker
3. 其他跟此教程无关的软件。


2. portainer

portainer是docker的web界面管理系统，可以不用一直在命令行操作docker，对命令不熟的人或者为了方便管理docker而设定。

具体安装可以参照docker hub, `https://hub.docker.com/u/portainer` 
下载：
```
docker pull portainer/portainer
```
启动portainer：
```
docker run -d -p 9000:9000 \
    --restart=always \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --name prtainer-test \
    portainer/portainer
```

接下来就进入正式mapbox离线安装的环节：
##  1. 下载 tileserver-gl，它是maobox地图服务器，类似于geoServer的感觉

具体参考文档：`https://tileserver.readthedocs.io/en/latest/`

注意的是：官方文档上给的教程是直接在linux命令行输入：

```
docker run --rm -it -v $(pwd):/data -p 8080:80 klokantech/tileserver-gl
```



他会在输入命令的当前linux文件夹 下载klokantech/tileserver-gl，并且检测到没有config.json以及mapbox的XXX.mbtiles文件。他会自动去下载 zurich_switzerland.mbtiles。 由于国内墙的原因,会十分的慢，而且zurich_switzerland 地图也应该不是我们想要的。

所以作者在这里不用以上方式安装，

在这里先安装好klokantech/tileserver-gl 就可以了。

```
docker pull klokantech/tileserver-gl
```

## 2. 配置地图服务基本目录结构(linux)

在自己的工作目录下，创建一下目录文件夹。

```
|-map-serve
  |--config.json
  |--data
  |--fonts
  |--styles
```

除了config.json 其他的名字都可以自定义：
1. config.json： 名字不可改；tileserver-gl 的启动文件，里面是 tileserver-gl服务的配置文件。
2. data： XXX.mbtiles 文件基本都在这里面放着，是地图有哪些数据的核心文件。
3. fonts：地图的字体文件。
4. styles：mapbox 的style样式文件。也是地图具体显示成什么样的核心文件。

## 3. 下载xxx.mbtiles 并上传到data文件夹。
开源社区提供了mbtiles文件的下载， `https://openmaptiles.com/downloads/planet/`。

此网站提供了 OpenStreetMap 的全球免费版下载。收费版数据更新快，免费版是2年前的数据。
如果全部下载有大约51G，可是选择具体的区域如中国，只有3.1G。

`下载完成之后上传到第二步中的data文件夹`。

## 4. 配置styles.json文件

style.json 文件是整个mapbox 地图的核心文件。

目前作者已知有两种方案获取style.json文件

1. mapbox studio： mapbox官方style.json样式编辑`https://studio.mapbox.com/`。
2. maputnik： 开源的style.json编辑项目，可离线安装`https://github.com/maputnik/editor`。

作者这里使用的是 maputnik 具体操作，以后另出教程, 官网上的国外小哥哥讲的有视频教程，可以自己看。

在这里作者提供了一份简单的 style.json 文件， 具体在demo里面 copy 到第二部中的`styles`文件夹直接用吧。

## 5. 字体文件的安装
mapbox 使用的是`.pbf` 格式的字体文件，具有速度快体积小的优势。pbf格式字体可以用传统的ttf，otf格式转化。具体方式请自行查阅，本教程demo 中提供了几种类型字体。

将字体文件 copy 到 自己的fonts 文件目录；


## 6. sprites 雪碧图加载



## 7. config.json文件

是tileserver-gl的启动文件，主要配置了，地图服务各个文件的依赖。具体参考demo。

## 8. 创建run.bat文件

内容如下：
```
docker run -itd\
 --name "map-xian"\
 --restart always\
 -v $(pwd):/data\
 -p 8080:80 klokantech/tileserver-gl
```

`chmod a+x`给整个地图服务文件夹添加权限（或者0777）, 执行 `./run.bat`;















 

## 1.提前准备安装的软件docker
这一步骤具体安装因人而异，总之就是需要按号docker环境。如果已经有了docker环境的直接去第2步；
作者的安装步骤：
1. 安装宝塔linux管理工具；
2. 宝塔安装docker容器；
3. 安装portainer 管理docker；




浏览器输入`服务器IP:9000`，进入 portainer管理界面。

docker run --rm -it -v $(pwd):/data -p 8080:80 klokantech/tileserver-gl




## mapbox studio 官方style.json样式编辑；
https://studio.mapbox.com/


## maputnik开元style.json编辑，可离线安装；

https://github.com/maputnik/editor