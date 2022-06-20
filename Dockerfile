FROM node:18.2 as dev
WORKDIR /usr/app
FROM dev as prod
COPY . /usr/app
RUN npm install
CMD node consumer.js
