# Nginx + Docker 打包部署流程

## 1. 需求

    为了方便镜像移植，一键启动，自动重启，选用docker生成镜像代码包，使用docker容器启动代码。

## 2. 软件或service

* docker
* nginx

## 3. 演示一个前端资源包的镜像服务

1. 前端代码写完之后，打包

```
npm run build  
//或者
yarn build
```

结果： 生成一个前端包，下面用名称为 'demo-front-end-app' 做演示。

2. 创建目录结构

```
前端镜像演示包
├── Dockerfile               //docker创建镜像文件
├── demo-front-end-app       //演示前端文件夹
│   ├── css
│   │   └── style.css
│   ├── index.html
│   └── js
│       └── main.js
└── nginx.conf               //nginx的配置文件，后面会用到
```

3. 先编辑nginx.conf文件

```
worker_processes auto;
events {
    worker_connections  1024;
}
 
http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    client_max_body_size   20m;

    server {
        listen       80;
        server_name  localhost;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

        error_page   500 502 503 504  /50x.html;

        location = /50x.html {
            root   html;
        }
    }
}
```

4. 编辑Dockerfile文件

为了方便配置，这边用的是nginx 作为资源服务器。也可以用tomcat 或者 其他。Dockerfile的内容，要根据选择的服务器做出调整，这里就不详细说了。 

```
FROM nginx

# 将demo-front-end-app文件夹中的内容复制到 /usr/share/nginx/html/ 这个目录下面
COPY demo-front-end-app/  /usr/share/nginx/html/

# 将自己配置的nginx.conf复制进去，也可以用挂载的方式，挂载在外面，为了减少依赖性，这里选择直接copy进去
COPY nginx.conf /etc/nginx/nginx.conf

RUN echo '镜像打包成功!!'
```


5. 命令行 进入到 Dockerfile 文件所在的目录，执行docker build命令

```
docker build -t 镜像名:tag .

# 镜像名 自定义，
# tag 标签版本号可以省略，不写默认是latest。
# . 小数点，表示 本次执行的上下文路径，也就是当前目录。

# docker build demo-fe-app .
```

结果： 使用 `docker images` 命令，可以查看到docker里面已经多了一个 名字为demo-fe-app的镜像, 如下：

```
REPOSITORY       TAG        IMAGE ID       CREATED          SIZE
demo-fe-app      latest     7aa2b702205f   3 minutes ago    133MB
```

6. 启动 `demo-fe-app` 容器

由于上面使用的是nginx服务器作为基础容器，所以 启动命令也是nginx容器的启动方式。
```
docker run -itd  -p 本地端口:容器内部端口 --name="容器名" --restart="always" 镜像名:tag

# 参数介绍：
# -itd : 以交互模式为容器重新分配一个伪输入终端，并在后台运行容器，返回容器ID；
# --name : 容器名称，自定义不要和已有的容器重复就行
# -p : 本地端口(docker  暴露给外面可以访问的端口):容器内部端口(docker容器内部端口，和nginx.conf文件中配置的一致 ，这里是80)
# 镜像名或镜像ID:tag :  如果镜像的tag是latest这里可以省略，否则就需要加上tag。 
# --restart="always" : 如果容器退出，就重启，一般是用在，电脑或服务器主机 开机后自动重启docker容器。 可以不加。

# 示例
# docker run -itd -p 3000:80 --name="demo-fe-app"  demo-fe-app
```

结果： 浏览器输入 `ip:3000` 能看到自己的 前端项目表示容器运行成功。


`到此为止，容器已经可以正常运行了。`

7. 镜像导出和导入，方便迁移

如果需要对镜像进行保存, 方便以后迁移使用，就需要把镜像导出成一个 tar 包文件。储存起来。

* 1. 查看容器镜像

```
% docker images

REPOSITORY    TAG     IMAGE ID      CREATED         SIZE
demo-fe-app   latest  7aa2b702205f  44 minutes ago  133MB

```
* 2. 导出target

```
docker save -o 文件名.tar 镜像名称:tag  （latest版本可以省略tag）

# 镜像名称:tag : 注意这里建议使用镜像名，不要使用镜像ID, 因为实际测试中，使用镜像ID导出的tar包再次导入后， 无法显示镜像名和镜像TAG。


# docker save -o demo-fe-app.tar demo-fe-app
```

`导出的镜像tar文件在输入命令的当前目录里面。`

* 3. 拿到tar包重新导入：

```
docker load -i 文件名.tar

# docker load -i demo-fe-app-id.tar
```
* 4. 执行 docker run 相关命令操作镜像即可。