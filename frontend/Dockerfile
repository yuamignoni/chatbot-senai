# Estágio de construção
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Fazer build
RUN npm run build

# Estágio de produção
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remover conteúdo padrão do Nginx
RUN rm -rf ./*

# Copiar arquivos buildados do estágio de construção
COPY --from=builder /app/dist .

# Copiar configuração personalizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"] 