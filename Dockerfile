FROM jekyll/builder
WORKDIR /paroparo
COPY . .

RUN apk update && apk add \
	npm;

RUN npm install -g gulp

RUN gulp serve

EXPOSE 3000