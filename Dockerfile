# Establecer la imagen base
FROM node:21-alpine

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Instalar dependencias globales
RUN npm install -g @nestjs/cli

# Copiar los archivos de paquete para instalar dependencias
COPY package*.json ./

# Instalar dependencias del proyecto
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto que la aplicación utiliza
EXPOSE 3000

# Comando para ejecutar la aplicación con hot-reload
CMD ["npm", "run", "start:dev"]
