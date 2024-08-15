# Dockerfile для Vue.js

FROM node:20 as build-stage

# Встановлюємо робочу директорію
WORKDIR /var/www/frontend

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо інші файли додатку
COPY . .

# Збірка Vue.js додатку для продакшену
RUN npm run build

# Використовуємо Nginx для розгортання
FROM nginx:alpine as production-stage
COPY --from=build-stage /var/www/frontend/dist /usr/share/nginx/html

WORKDIR /usr/share/nginx/html

# Експонуємо порт
EXPOSE 80

# Запускаємо Nginx
CMD ["nginx", "-g", "daemon off;"]
