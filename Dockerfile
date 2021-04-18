FROM jekyll/builder as builder
WORKDIR /paroparo

RUN apk add --update nodejs npm autoconf libtool automake nasm make g++

COPY package.json ./
RUN npm install
ENV PATH node_modules/.bin:$PATH

COPY . .

RUN gulp build

FROM nginx:alpine
COPY --from=builder _site /usr/share/nginx/html

EXPOSE 80

