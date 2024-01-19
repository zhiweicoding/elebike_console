# 使用 Nginx 官方镜像作为运行环境
FROM nginx:stable-alpine as production-stage
# 从构建阶段复制构建出的文件到 Nginx 服务器
COPY ./dist /usr/share/nginx/html
# 替换默认的 Nginx 配置文件
COPY ./nginx.conf /etc/nginx/nginx.conf
# 暴露 8084 端口
EXPOSE 8084
# 启动 Nginx 服务器
CMD ["nginx", "-g", "daemon off;"]
