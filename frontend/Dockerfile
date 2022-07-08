FROM node:18-alpine

RUN npm i -g pnpm

COPY package*.json .
COPY pnpm-lock.yaml .

RUN pnpm install --frozen-lockfile

COPY . ./

EXPOSE 3000
ENTRYPOINT [ "pnpm", "start" ]