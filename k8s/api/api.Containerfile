FROM node:18.10.0-bullseye-slim

RUN useradd --create-home kanban
WORKDIR /home/kanban
RUN mkdir api
WORKDIR api

COPY package.json .
COPY yarn.lock .
RUN yarn --production
COPY . .

USER kanban
CMD [ "yarn", "start" ]
