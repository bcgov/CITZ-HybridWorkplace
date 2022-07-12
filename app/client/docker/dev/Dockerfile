#############################################################################################
###                         FOR DEV BUILD ONLY                                            ###
#############################################################################################
FROM node:17.9.0-alpine3.14

# Install/Update Node.js and Node Package Manager
RUN apk add --update nodejs && apk add npm 

# Create app directory
WORKDIR /usr/src/app/client

# Install dependencies
COPY app/client/package*.json ./
RUN npm ci
