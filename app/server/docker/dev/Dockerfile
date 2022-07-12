FROM node:17.9.0-alpine3.14

# Install/Update Node.js and Node Package Manager
RUN apk add --update nodejs && apk add npm

# Install nodemon
RUN npm i -g nodemon

# Add curl for health check
RUN apk --update --no-cache add curl

# Create app directory
WORKDIR /usr/src/app/server

# Install dependencies
COPY app/server/package*.json ./
RUN npm ci

# CMD only used if not specifed in docker-compose
CMD ["nodemon", "-L", "index.js"]
