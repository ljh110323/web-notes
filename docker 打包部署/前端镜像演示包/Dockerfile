FROM nginx
# 定义作者
MAINTAINER longdb
# 将dist文件中的内容复制到 /usr/share/nginx/html/ 这个目录下面
COPY demo-front-end-app/  /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
RUN echo 'echo init ok!!'