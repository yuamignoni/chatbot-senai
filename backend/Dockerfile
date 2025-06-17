# Estágio de construção
FROM node:18-alpine AS builder
WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache openssl

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências (incluindo dev para build)
RUN npm ci

# Copiar código fonte
COPY . .

# Gerar cliente Prisma e fazer build
RUN npx prisma generate
RUN npm run build

# Estágio de produção
FROM node:18-alpine AS production
WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache dumb-init openssl wget

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar arquivos necessários do estágio de build
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma/

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Gerar cliente Prisma para produção
RUN npx prisma generate

# Copiar aplicação buildada
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Mudar para usuário não-root
USER nodejs

EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "echo 'Waiting for database...' && npx prisma db push && echo 'Starting application...' && npm start"]