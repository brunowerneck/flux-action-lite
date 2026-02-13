FROM node:20-alpine

WORKDIR /app

# Instalar dependências necessárias para o chokidar funcionar corretamente
RUN apk add --no-cache git

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Expor a porta do Vite
EXPOSE 5173

# Comando para desenvolvimento com HMR
CMD ["npm", "run", "dev"]
