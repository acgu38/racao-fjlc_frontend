# Use a imagem oficial do Node.js
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json (se existir) para o container
COPY frontend/package*.json ./frontend/

# Instala as dependências do frontend
RUN npm install

# Copia o restante do código do frontend
COPY frontend/ .

# Constrói o frontend para produção
RUN npm run build

# Usa um servidor web estático para servir os arquivos do frontend
FROM nginx:alpine

# Copia os arquivos buildados do frontend para o diretório de arquivos do nginx
COPY --from=0 /app/build /usr/share/nginx/html

# Expõe a porta 80, que é a porta padrão do nginx
EXPOSE 80

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]