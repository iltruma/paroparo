FROM jekyll/builder
WORKDIR /paroparo

RUN apk add --update nodejs npm autoconf libtool automake nasm make g++

COPY package.json ./
RUN npm install
ENV PATH node_modules/.bin:$PATH

COPY . .

RUN gulp serve

EXPOSE 3000