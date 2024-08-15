# 1. Базовий образ для збірки додатку
FROM node:18-alpine as build-stage

# Встановлюємо робочий каталог
WORKDIR /app

# Копіюємо package.json і package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо решту файлів додатку
COPY . .

# Виконуємо збірку додатку
RUN npm run build

# 2. Базовий образ для продакшн
FROM nginx:alpine

# Копіюємо зібрані файли з етапу збірки у NGINX
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Копіюємо конфігураційний файл NGINX
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Відкриваємо порт 80 для NGINX
EXPOSE 80 443

# Запускаємо NGINX
CMD ["nginx", "-g", "daemon off;"]
