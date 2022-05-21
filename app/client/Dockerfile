#############################################################################################
###                                 BUILD ARTIFACT                                        ###
#############################################################################################
FROM node:17.9.0-alpine3.14 as build
WORKDIR /usr/src/app/client

COPY app/client/package*.json ./
RUN npm ci
COPY app/client/. .

RUN npm run build

#############################################################################################
###                                 PRODUCTION IMAGE                                      ###
#############################################################################################
FROM nginx:1.19-alpine
# Stage 2 - serve with nginx

RUN apk add --update nodejs && apk add npm 
RUN npm i -g nodemon

WORKDIR /usr/share/nginx/html

ARG env

# Removes the default static files
RUN rm -rf /usr/share/nginx/html/
COPY --from=build /usr/src/app/client/build .

RUN rm /etc/nginx/conf.d/default.conf
COPY app/client/nginx.conf /etc/nginx/conf.d/default.conf

COPY app/client/env.sh .

# Copy env file, default .env-template
COPY $env .env

#Elevate!
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx
RUN chmod g+rwx /usr/share/nginx/html

# Add bash
RUN apk add --no-cache bash

#RUN chgrp -R 0 /etc/nginx && chmod -R g=u /etc/nginx

# Make our shell script executable
RUN chmod g+rwx env.sh

# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\" "]
