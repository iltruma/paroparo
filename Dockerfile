FROM jekyll/builder
WORKDIR /paroparo

RUN apk update && apk add \
	npm;

COPY package*.json ./
RUN npm install

COPY . .

RUN gulp serve

EXPOSE 3000
