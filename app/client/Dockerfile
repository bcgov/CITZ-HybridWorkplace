# Stage 1 - build react front-end
FROM node:17.9.0-alpine3.14 as build
WORKDIR /usr/src/app
ENV PATH /node_modules/.bin:$PATH
COPY package*.json ./
RUN npm ci
COPY . .

# Originally used CMD ["npm", "start"] which didn't build the 
# image. I then tried CMD["npm", "run", "build"] however, this 
# caused an error where docker couldn't find a cache key.
RUN npm run build

# Stage 2 - serve with nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
# Removes the default static files
RUN rm -rf ./*
COPY --from=build /usr/src/app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["nginx", "-g", "daemon off;"]

