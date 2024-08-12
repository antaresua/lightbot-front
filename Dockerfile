# Вибираємо базовий образ Node.js
FROM node:20 AS build

# Налаштовуємо робочий каталог
WORKDIR /app

# Копіюємо package.json і package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо код проєкту
COPY . .

# Створюємо продакшн-версію
RUN npm run build

# Вибираємо базовий образ для веб-сервера
FROM nginx:alpine

# Копіюємо продакшн-версію з попереднього етапу
COPY --from=build /app/dist /usr/share/nginx/html

# Виставляємо порт
EXPOSE 80

# Запускаємо Nginx
CMD ["nginx", "-g", "daemon off;"]
