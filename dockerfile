# Imagen base
FROM node:20.17.0

# Crea un directorio llamado "app" en la ruta /usr/src/ con la opción -p para asegurar que se crean todos los subdirectorios, incluso si ya existen.
RUN mkdir -p /usr/src/app

# Establece la ruta de trabajo para las siguientes instrucciones
WORKDIR /usr/src/app

# Copia los archivos que coincidan con el patrón package*.json desde el sistema de archivos del host hasta el directorio de trabajo actual del contenedor
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia todos los archivos y carpetas del directorio actual en el sistema de archivos del host
donde se está construyendo el contenedor Docker al directorio de trabajo actual en el
contenedor
COPY . .

# Indica que el contenedor escuchará en el puerto 8080
EXPOSE 8080

# Especifica el comando por defecto para ejecutar al iniciar el contenedor
CMD ["npm", "start"]