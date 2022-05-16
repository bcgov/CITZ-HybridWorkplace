FROM node:17.9.0-alpine3.14

# Create app directory
WORKDIR /usr/src/app

ARG env

COPY $env .env

COPY app/server/package*.json ./

RUN npm ci --only=production

COPY app/server/. .

CMD ["node", "index.js"]
