# Використовуємо офіційний Node.js образ
FROM node:20

# Встановлюємо робочу директорію
WORKDIR /var/www/frontend

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо інші файли додатку
COPY . .

# Збірка Vue.js додатку
RUN npm run build

# Використовуємо Nginx для розгортання
FROM nginx:alpine
COPY --from=0 /var/www/frontend/dist /usr/share/nginx/html

# Експонуємо порт
EXPOSE 80

# Запускаємо Nginx
CMD ["nginx", "-g", "daemon off;"]
