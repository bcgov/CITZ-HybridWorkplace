FROM node:17.9.0-alpine3.14

RUN apk add --update nodejs && apk add npm
RUN npm i -g nodemon

# Create app directory
WORKDIR /usr/src/app

COPY app/server/package*.json ./

RUN npm ci --only=production

# Add curl for health check
RUN apk --update --no-cache add curl

COPY app/server/. ./

ARG env

COPY $env .env

CMD ["node", "index.js"]
