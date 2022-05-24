FROM node:16

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

EXPOSE 4000
CMD [ "node", "dist/index.js" ]
USER node