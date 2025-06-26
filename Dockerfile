FROM node:18-alpine

WORKDIR /usr/migrater

COPY ./migrations ./migrations
COPY ./src ./src
COPY ./migrations/version.ts ./migrations/version.ts
COPY ./migrations/tsconfig.knex.json ./migrations/tsconfig.knex.json
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json


RUN npm install
