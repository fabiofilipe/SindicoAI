# SindicoAI - Portal do Morador

Portal web para moradores de condomínios acessarem serviços, fazerem reservas de áreas comuns, visualizarem notificações e interagirem com assistente virtual.

##  Tecnologias

- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **TailwindCSS** - Framework CSS com design system customizado
- **React Router** - Navegação
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones
- **Date-fns** - Manipulação de datas

##  Design System

O projeto utiliza um design system **Industrial Tech** com as seguintes cores principais:

- **Base:** Coal (#0B0C10), Coal Light (#1F2833)
- **Accent:** Cyan (#00FFF0), Tech Blue (#0A84FF)
- **Status:** Terminal Green (#30D158), Alert Orange (#FF9F0A), Critical Red (#FF453A)
- **Neutral:** Metal Silver (#C7C7CC)

##  Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── auth/            # Componentes de autenticação
│   │   └── PrivateRoute.tsx
│   ├── forms/           # Componentes de formulário
│   │   └── Input.tsx
│   ├── layout/          # Componentes de layout
│   │   └── MainLayout.tsx
│   ├── ui/              # Componentes UI base
│   │   ├── Button.tsx
│   │   ├── HologramCard.tsx
│   │   └── Modal.tsx
│   └── index.ts         # Barrel exports
│
├── contexts/            # Contextos React
│   ├── AuthContext.tsx  # Gerenciamento de autenticação
│   └── index.ts
│
├── pages/               # Páginas da aplicação
│   ├── assistant/       # Assistente Virtual (IA)
│   │   └── AssistantPage.tsx
│   ├── auth/            # Autenticação
│   │   └── LoginPage.tsx
│   ├── home/            # Página inicial
│   │   └── HomePage.tsx
│   ├── notifications/   # Notificações
│   │   └── NotificationsPage.tsx
│   ├── profile/         # Perfil do usuário
│   │   └── ProfilePage.tsx
│   ├── reservations/    # Reservas de áreas comuns
│   │   └── ReservationsPage.tsx
│   └── index.ts
│
├── services/            # Serviços de API
│   ├── api.ts           # Configuração do Axios
│   ├── authService.ts   # Autenticação
│   ├── aiService.ts     # Assistente IA
│   ├── commonAreaService.ts  # Áreas comuns
│   ├── notificationService.ts # Notificações
│   ├── reservationService.ts  # Reservas
│   └── index.ts
│
├── types/               # Definições TypeScript
│   ├── auth.ts          # Tipos de autenticação
│   └── models.ts        # Modelos de dados
│
├── App.tsx              # Componente raiz com rotas
├── main.tsx             # Entry point
└── index.css            # Estilos globais e utilities
```

##  Credenciais de Acesso

### Ambiente de Desenvolvimento
- **Email:** morador@prime.com
- **Senha:** morador123

##  Como Rodar

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Docker

```bash
# Build e iniciar container
docker-compose up -d frontend-morador

# Acessar em
http://localhost:3000
```

##  Funcionalidades

### ✅ Implementadas

- **Autenticação**
  - Login com email/senha
  - Proteção de rotas privadas
  - Refresh token automático
  - Logout

- **Página Inicial (Dashboard)**
  - Resumo de notificações
  - Últimas reservas
  - Avisos importantes
  - Navegação rápida

- **Reservas de Áreas Comuns**
  - Visualizar áreas disponíveis
  - Calendário interativo
  - Criar nova reserva
  - Listar minhas reservas
  - Cancelar reserva

- **Notificações**
  - Listar todas as notificações
  - Marcar como lida
  - Filtro por status

- **Assistente Virtual (IA)**
  - Chat interativo com IA
  - Histórico de conversas
  - Sugestões de perguntas
  - Respostas contextualizadas sobre o condomínio

- **Perfil**
  - Visualizar dados pessoais
  - Editar informações
  - Alterar senha

## 🔌 API Integration

O frontend se comunica com o backend através de:

- **Base URL:** `http://localhost:8000/api/v1`
- **Autenticação:** Bearer Token (JWT)
- **Interceptors:** Refresh automático de tokens expirados

### Principais Endpoints

```typescript
// Autenticação
POST /auth/login
POST /auth/refresh

// Usuário
GET /users/me
PUT /users/me
PUT /users/me/password

// Áreas Comuns
GET /common-areas
GET /common-areas/:id

// Reservas
GET /reservations/me
POST /reservations
DELETE /reservations/:id

// Notificações
GET /notifications/me
PUT /notifications/:id/read

// Assistente IA
POST /ai/chat
```

##  Componentes Principais

### HologramCard
Card com efeito glassmorphism e borda neon.

```tsx
<HologramCard className="p-6">
  <h3>Conteúdo</h3>
</HologramCard>
```

### Button
Botão com variantes e estados de loading.

```tsx
<Button
  variant="primary"
  size="lg"
  isLoading={loading}
  fullWidth
>
  Enviar
</Button>
```

### Input
Input com label, erro e ícones.

```tsx
<Input
  label="Email"
  type="email"
  error={errors.email}
  required
/>
```

### Modal
Modal responsivo com overlay.

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Título"
  size="md"
>
  <p>Conteúdo</p>
</Modal>
```

##  Autenticação

O sistema utiliza JWT tokens com:

- **Access Token:** Válido por 60 minutos
- **Refresh Token:** Válido por 7 dias
- **Auto-refresh:** Renovação automática quando access token expira
- **Persistência:** Tokens salvos no localStorage

##  Rotas

```
/login              - Página de login (pública)
/                   - Home / Dashboard (privada)
/reservations       - Reservas de áreas (privada)
/notifications      - Notificações (privada)
/assistant          - Assistente IA (privada)
/profile            - Perfil do usuário (privada)
```

##  Build & Deploy

### Build de Produção

```bash
npm run build
```

Gera arquivos otimizados em `dist/`:
- HTML minificado
- CSS com Tailwind purged
- JS com code splitting
- Assets otimizados

### Deploy com Docker

O Dockerfile utiliza multi-stage build:
1. **Builder:** Node.js Alpine para build
2. **Runtime:** Nginx Alpine para servir arquivos estáticos

```dockerfile
# Build
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

##  Desenvolvimento

### Path Aliases

O projeto usa path aliases para imports mais limpos:

```typescript
// ❌ Antes
import Button from '../../../components/ui/Button'

// ✅ Depois
import { Button } from '@/components'
```

Configurado em `vite.config.ts` e `tsconfig.json`:

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### Hot Module Replacement

Vite oferece HMR instantâneo para:
- Componentes React
- Estilos CSS/Tailwind
- Mudanças de código

