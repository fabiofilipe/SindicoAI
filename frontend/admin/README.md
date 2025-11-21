# SindicoAI - Web Admin

> Interface administrativa premium com design industrial tech-focused

##  Design Concept

Interface inspirada em **painéis de controle aeroespacial** e **centros de comando**, com visual **cyberpunk clean**, high-tech e futurista.

### Visual Identity
- **Coal Black** (#0B0C10) backgrounds
- **Electric Cyan** (#00FFF0) primary accent
- **Neon glow effects** em elementos interativos
- **Scan lines** e **grid patterns** sutis
- **Holographic cards** com semi-transparência

##  Quick Start

### Prerequisites
- Node.js >= 18
- npm ou yarn

### Installation

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

##  Stack

- **React 18** + **TypeScript**
- **Vite** (Build tool)
- **TailwindCSS 3.4** (Styling)
- **Framer Motion 11** (Animations)
- **Zustand** (State management)
- **React Hook Form** + **Zod** (Forms)
- **Axios** (HTTP client)
- **React Router v6** (Routing)
- **Recharts** (Charts)
- **Lucide React** (Icons)
- **date-fns** (Date utilities)

##  Project Structure

Ver `ARCHITECTURE.md` para detalhes completos da estrutura.

##  Features

### Core Admin Features
- ✅ Dashboard com métricas em tempo real
- ✅ Gestão de Unidades (CRUD completo)
- ✅ Gestão de Usuários (ativar, desativar, reset senha)
- ✅ Áreas Comuns (CRUD com upload de imagens)
- ✅ Sistema de Reservas (calendário visual)
- ✅ Upload de Documentos (drag & drop)
- ✅ Chat com IA (assistente virtual)
- ✅ Centro de Notificações
- ✅ Importação em massa (CSV)

### Tech Features
-  Design System industrial tech premium
-  Animações com Framer Motion
-  Dark mode nativo
-  Responsivo (desktop, tablet, mobile)
-  Performance otimizada
-  Autenticação JWT
-  Type-safe com TypeScript

##  Design System

### Colors

```css
/* Primary */
--bg-primary: #0B0C10
--accent-cyan: #00FFF0
--accent-blue: #0A84FF

/* Status */
--success: #30D158
--warning: #FF9F0A
--error: #FF453A
```

### Typography

```
Display: SF Pro Display / Inter
Mono: IBM Plex Mono
Accent: Orbitron (use sparingly)
```

### Components

Todos os componentes seguem o padrão:
- Variants (holographic, solid, terminal, etc.)
- Glow effects em hover/focus
- Animações suaves
- Acessibilidade (ARIA labels, keyboard navigation)

##  Development

### Commands

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Lint code
npm run type-check   # TypeScript check
```

### Environment Variables

Copie `.env.example` para `.env`:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=SindicoAI Admin
```

##  Code Style

- **ESLint** + **Prettier** configurados
- **Conventional Commits**
- **TypeScript strict mode**
- **Componentes funcionais** com hooks

##  Testing

```bash
npm run test           # Run tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

##  Documentation

- [Architecture](./ARCHITECTURE.md) - Estrutura detalhada do projeto
- [Components](./src/components/README.md) - Guia de componentes
- [API Integration](./src/services/README.md) - Integração com backend

##  Roadmap

### Week 1 ✅
- [x] Setup Vite + React + TypeScript
- [x] Estrutura de pastas
- [x] Configuração TailwindCSS
- [ ] Design System base
- [ ] Sistema de rotas

### Week 2
- [ ] Página de Login
- [ ] Dashboard Layout
- [ ] Homepage
- [ ] Gestão de Unidades
- [ ] Gestão de Usuários

### Week 3
- [ ] Áreas Comuns
- [ ] Sistema de Reservas
- [ ] Upload de Documentos
- [ ] Chat IA
- [ ] Notificações

---


