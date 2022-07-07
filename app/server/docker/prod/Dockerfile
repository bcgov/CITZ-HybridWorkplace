FROM node:17.9.0-alpine3.14

# Install/Update Node.js and Node Package Manager
RUN apk add --update nodejs && apk add npm

# Add curl for health check
RUN apk --update --no-cache add curl

# Create app directory
WORKDIR /usr/src/app

# Copy files from server to working directory
COPY app/server/. ./

# Install dependencies
RUN npm ci --only=production

# Copy env file to working directory
ARG env

COPY $env .env

# CMD only used if not specifed in docker-compose
CMD ["node", "index.js"]
