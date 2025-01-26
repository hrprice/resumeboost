FROM node:20

WORKDIR /usr/src/app

COPY ./package.json .

COPY ./yarn.lock .

COPY ./packages/shared ./packages/shared

COPY ./packages/api ./packages/api

RUN yarn install --pure-lockfile && yarn playwright install-deps && yarn playwright install

WORKDIR /usr/src/app/packages/api

RUN yarn build

EXPOSE 3001

CMD ["node", "dist/api/src/main"]