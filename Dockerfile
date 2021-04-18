FROM jekyll/builder
WORKDIR /paroparo

RUN apk add --update nodejs npm

COPY package.json ./
RUN npm install --no-optional
ENV PATH node_modules/.bin:$PATH

COPY . .

RUN gulp serve

EXPOSE 3000

