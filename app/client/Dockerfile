# Stage 1 - build react front-end
FROM node:17.9.0-alpine3.14 as build
WORKDIR /usr/src/app
ENV PATH /node_modules/.bin:$PATH

COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build

# Stage 2 - serve with nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Removes the default static files
RUN rm -rf ./*
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

COPY ./env.sh .
COPY .env .

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh

# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]

# Already tried...

#CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx", "-g", "daemon off;"]

# and...

#CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh"]
#ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
