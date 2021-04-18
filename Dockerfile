FROM jekyll/builder as builder
WORKDIR /paroparo

RUN apk add --update nodejs npm autoconf libtool automake nasm make g++

COPY package.json ./
RUN npm install
ENV PATH node_modules/.bin:$PATH

COPY . .
RUN touch Gemfile.lock && chmod a+w Gemfile.lock
RUN gulp build

FROM nginx:alpine
COPY --from=builder paroparo/_site /usr/share/nginx/html

EXPOSE 3000