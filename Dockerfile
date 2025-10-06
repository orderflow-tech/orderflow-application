FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Copiar código fonte
COPY src/ ./src/

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM node:18-alpine AS production

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S orderflow -u 1001

WORKDIR /app

# Copiar dependências de produção
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copiar build da aplicação
COPY --from=builder /app/dist ./dist

# Criar diretórios necessários
RUN mkdir -p /tmp /var/cache && \
    chown -R orderflow:nodejs /app /tmp /var/cache

# Mudar para usuário não-root
USER orderflow

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando de inicialização
CMD ["node", "dist/infrastructure/http/server.js"]

