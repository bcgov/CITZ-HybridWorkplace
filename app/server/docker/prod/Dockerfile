FROM node:17.9.0-alpine3.14

RUN apk add --update nodejs && apk add npm

# Add curl for health check
RUN apk --update --no-cache add curl

# Create app directory
WORKDIR /usr/src/app

COPY app/server/. ./

RUN npm ci --only=production

ARG env

COPY $env .env

CMD ["node", "index.js"]
