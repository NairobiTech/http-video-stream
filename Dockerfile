FROM node:14.16.0-slim

WORKDIR /api

COPY . .

RUN yarn install

EXPOSE 3001

CMD yarn start