# Stage 1 - build react app first 
FROM node:17.9.0-alpine3.14 as build
WORKDIR /usr/src/app
ENV PATH /node_modules/.bin:$PATH
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "start"]
