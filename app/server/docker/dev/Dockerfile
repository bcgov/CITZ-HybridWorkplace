FROM node:17.9.0-alpine3.14

RUN apk add --update nodejs && apk add npm
RUN npm i -g nodemon

# Add curl for health check
RUN apk --update --no-cache add curl

# Create app directory
WORKDIR /usr/src/app/server

ARG env

COPY $env .env

# Not needed for docker-compose
CMD ["node", "index.js"]
