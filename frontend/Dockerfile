# ============================================
# Dockerfile Genérico para Frontends SindicoAI
# Suporta: morador, funcionario, admin
# ============================================

# Argumento para definir qual app buildar
ARG APP_NAME=morador

# ============================================
# Stage 1: Build da aplicação
# ============================================
FROM node:20-alpine AS builder

# Definir qual app será buildado
ARG APP_NAME
WORKDIR /app/${APP_NAME}

# Copiar package.json e package-lock.json do app específico
COPY ${APP_NAME}/package*.json ./

# Instalar dependências
RUN npm ci --legacy-peer-deps

# Copiar código fonte do app específico
COPY ${APP_NAME}/ ./

# Build da aplicação
RUN npm run build

# ============================================
# Stage 2: Servidor de produção com Nginx
# ============================================
FROM nginx:alpine

# Copiar arquivos buildados do stage anterior
ARG APP_NAME
COPY --from=builder /app/${APP_NAME}/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Adicionar label para identificar qual app é este container
LABEL app=${APP_NAME}

# Expor porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
