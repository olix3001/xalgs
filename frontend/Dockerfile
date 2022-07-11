FROM node:18-alpine

RUN npm i -g pnpm

COPY package*.json .
COPY pnpm-lock.yaml .

RUN pnpm install --frozen-lockfile

COPY . ./

RUN pnpm run build

EXPOSE 8080
ENTRYPOINT [ "pnpm", "start" ]