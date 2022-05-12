FROM node:17.9.0-alpine3.14

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["node", "index.js"]
