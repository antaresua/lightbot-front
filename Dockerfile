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

# Copy certs for https
COPY docker/nginx/certs/fullchain.pem /etc/nginx/certs/fullchain.pem
COPY docker/nginx/certs/privkey.pem /etc/nginx/certs/privkey.pem
RUN chown -R nginx:nginx /etc/nginx/certs
RUN chmod 644 /etc/nginx/certs/fullchain.pem
RUN chmod 600 /etc/nginx/certs/privkey.pem

# Expose port 8080
EXPOSE 8080