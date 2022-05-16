# Stage 1 - build react front-end
FROM node:17.9.0-alpine3.14 as build
WORKDIR /usr/src/app
#ENV PATH /node_modules/.bin:$PATH

COPY app/client/package*.json ./
RUN npm ci
COPY app/client/. .

RUN npm run build

# Stage 2 - serve with nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

ARG env

# Removes the default static files
RUN rm -rf ./*
RUN rm /etc/nginx/conf.d/default.conf
COPY app/client/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/build /usr/share/nginx/html

COPY app/client/./env.sh .

# Copy env file, default .env-template
COPY $env .env

# Add bash
RUN apk add --no-cache bash

#Elevate!
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx
RUN chmod g+rwx /usr/share/nginx/html

# Make our shell script executable
RUN chmod g+rwx env.sh

# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
