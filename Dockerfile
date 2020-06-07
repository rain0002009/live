FROM alpine:latest AS install

WORKDIR /usr/src/live

COPY package.json yarn.lock ./

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
 && apk add --no-cache --update nodejs yarn \
 && yarn config set registry https://registry.npm.taobao.org/ \
 && yarn install

FROM alpine:latest

WORKDIR /usr/src/live

COPY --from=install /usr/src/live/node_modules ./node_modules
COPY . .

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
 && apk add --no-cache --update nodejs yarn \
 && yarn run build

EXPOSE 3001

ENV NODE_ENV=production

CMD [ "yarn","start" ]
