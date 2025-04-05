FROM node:alpine AS base
WORKDIR /usr/src/app
COPY package.json .
RUN npm i -g yarn --force
RUN yarn install
COPY . .
EXPOSE 3003

FROM base AS development
ENV NODE_ENV=development
CMD [ "yarn", "run", "start:dev" ]

FROM base AS production
ENV NODE_ENV=production
RUN npm run build
RUN rm -rf ./src
RUN rm -rf ./packages/shared
CMD [ "node", "dist/main" ]