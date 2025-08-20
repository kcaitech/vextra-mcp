# build vextra web
FROM node:22-alpine3.22 AS builder
WORKDIR /app
COPY . /app
RUN npm i && npm run build
RUN cd /app/home && npm i && npm run build

FROM node:22-alpine3.22
ENV TZ=Asia/Shanghai
RUN set -ex \
    # && sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
    && apk upgrade --no-cache --available \
    && apk add --no-cache font-noto font-noto-cjk font-freefont fontconfig

WORKDIR /app

COPY --from=builder /app/home/dist /app/home
COPY --from=builder /app/dist /app
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 80
ENTRYPOINT [ "node", "server.js", "--port", "80", "--config", "config/config.yaml" ]