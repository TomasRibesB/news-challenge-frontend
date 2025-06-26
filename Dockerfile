# Etapa de compilación
FROM node:22-alpine AS builder
WORKDIR /app

# Copiar archivos de definición de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código y compilar en modo producción
COPY . .
RUN npm run build -- --configuration production

# Etapa de producción
FROM nginx:alpine

# Copiar archivos compilados a la carpeta de nginx
COPY --from=builder /app/dist/news-challenge-frontend /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Arrancar nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
