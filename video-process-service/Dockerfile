FROM ubuntu:focal AS base

RUN /usr/bin/apt-get update && \
    /usr/bin/apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    /usr/bin/apt-get update && \
    /usr/bin/apt-get upgrade -y && \
    /usr/bin/apt-get install -y nodejs ffmpeg

WORKDIR /usr/src/app
COPY package.json .
RUN npm i -g yarn --force
RUN yarn install
COPY . .
EXPOSE 3004

FROM base AS development
ENV NODE_ENV=development
CMD [ "yarn", "run", "start:dev" ]

FROM base AS production
ENV NODE_ENV=production
RUN npm run build
RUN rm -rf ./src
RUN rm -rf ./packages/shared
CMD [ "node", "dist/main" ]