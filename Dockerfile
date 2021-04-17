FROM jekyll/builder
WORKDIR /paroparo

RUN apk update && apk add \
	npm;

ADD package.json /tmp
RUN cd /tmp && npm install --no-optional && npm cache clean --force
RUN mv /tmp/node_modules /paroparo
COPY . /paroparo
RUN cd ..

RUN gulp serve

EXPOSE 3000
