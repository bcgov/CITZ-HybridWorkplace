# Stage 1 - build react front-end
FROM node:17.9.0-alpine3.14 as build
WORKDIR /usr/src/app
ENV PATH /node_modules/.bin:$PATH

ENV REACT_APP_API_REF=http://localhost:5000/api
ENV REACT_APP_BCGOV_HOMEPAGE_URL=https://www2.gov.bc.ca/gov/content/home
ENV REACT_APP_GITHUB_REPO_URL=http://github.com/bcgov/CITZ-HybridWorkplace
ENV REACT_APP_BCGOV_EXCHANGE_URL=http://BCDevExchange.org

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

