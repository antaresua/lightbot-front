# Stage 1: Build the Vue.js application
FROM node:20 as build-stage
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 2: Serve the application with nginx
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
