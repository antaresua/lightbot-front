# Stage 1: Build the Vue.js application
FROM node:20 as build-stage
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Install openssl package (if needed)
RUN apk add --no-cache openssl

# Copy built Vue.js static files into Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80 443