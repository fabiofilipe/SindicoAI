# Frontend Admin - Estrutura de Pastas

## Arquitetura Completa

```
frontend/admin/
├── public/                      # Assets estáticos
│   ├── fonts/                  # Fontes customizadas
│   └── images/                 # Imagens e ícones
│
├── src/
│   ├── components/             # Componentes reutilizáveis
│   │   ├── layout/            # Layouts e estruturas
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navbar.tsx
│   │   │
│   │   ├── ui/                # Componentes básicos UI
│   │   │   ├── Card.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── DataCard.tsx
│   │   │
│   │   ├── forms/             # Componentes de formulário
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── Textarea.tsx
│   │   │   └── FileUpload.tsx
│   │   │
│   │   ├── feedback/          # Feedback para usuário
│   │   │   ├── Toast.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ProgressBar.tsx
│   │   │
│   │   ├── navigation/        # Navegação
│   │   │   ├── Breadcrumb.tsx
│   │   │   └── TabNav.tsx
│   │   │
│   │   ├── tech/              # Componentes tech-specific
│   │   │   ├── GridBackground.tsx
│   │   │   ├── ScanLine.tsx
│   │   │   ├── ParticleBackground.tsx
│   │   │   ├── NeonText.tsx
│   │   │   ├── GlitchText.tsx
│   │   │   ├── DataStream.tsx
│   │   │   └── HologramCard.tsx
│   │   │
│   │   ├── ai/                # Componentes de IA
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   └── SuggestedQuestions.tsx
│   │   │
│   │   └── index.ts           # Barrel export
│   │
│   ├── pages/                 # Páginas da aplicação
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── units/
│   │   │   ├── UnitsListPage.tsx
│   │   │   ├── UnitDetailPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── users/
│   │   │   ├── UsersListPage.tsx
│   │   │   ├── UserDetailPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── common-areas/
│   │   │   ├── AreasListPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── reservations/
│   │   │   ├── ReservationsPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── documents/
│   │   │   ├── DocumentsPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── ai/
│   │   │   ├── AIAssistantPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── notifications/
│   │   │   ├── NotificationsPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── imports/
│   │   │   ├── ImportsPage.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── settings/
│   │       ├── SettingsPage.tsx
│   │       └── index.ts
│   │
│   ├── features/              # Features organizadas por domínio
│   │   ├── auth/
│   │   │   ├── api/           # API calls específicas
│   │   │   ├── components/    # Componentes do feature
│   │   │   ├── hooks/         # Hooks customizados
│   │   │   └── types.ts
│   │   │
│   │   ├── units/
│   │   ├── users/
│   │   ├── areas/
│   │   ├── reservations/
│   │   ├── documents/
│   │   └── notifications/
│   │
│   ├── services/              # Serviços da aplicação
│   │   ├── api.ts            # Configuração Axios
│   │   ├── auth.service.ts
│   │   ├── units.service.ts
│   │   ├── users.service.ts
│   │   ├── areas.service.ts
│   │   ├── reservations.service.ts
│   │   ├── documents.service.ts
│   │   ├── ai.service.ts
│   │   └── notifications.service.ts
│   │
│   ├── hooks/                 # Custom hooks globais
│   │   ├── useAuth.ts
│   │   ├── useToast.ts
│   │   ├── useModal.ts
│   │   └── useDebounce.ts
│   │
│   ├── store/                 # Estado global (Zustand)
│   │   ├── authStore.ts
│   │   ├── userStore.ts
│   │   ├── notificationStore.ts
│   │   └── index.ts
│   │
│   ├── types/                 # Types e interfaces TypeScript
│   │   ├── api.types.ts
│   │   ├── auth.types.ts
│   │   ├── units.types.ts
│   │   ├── users.types.ts
│   │   ├── areas.types.ts
│   │   ├── reservations.types.ts
│   │   └── index.ts
│   │
│   ├── utils/                 # Funções utilitárias
│   │   ├── formatters.ts     # Formatação de dados
│   │   ├── validators.ts     # Validadores
│   │   ├── constants.ts      # Constantes
│   │   └── helpers.ts        # Helper functions
│   │
│   ├── styles/                # Estilos e configurações
│   │   ├── globals.css       # Estilos globais
│   │   ├── animations.css    # Animações customizadas
│   │   └── tailwind.config.js # Config TailwindCSS
│   │
│   ├── assets/                # Assets do projeto
│   │   ├── icons/
│   │   └── images/
│   │
│   ├── App.tsx                # Componente principal
│   ├── main.tsx               # Entry point
│   ├── router.tsx             # Configuração de rotas
│   └── vite-env.d.ts          # Types do Vite
│
├── .env.example               # Variáveis de ambiente template
├── .eslintrc.json             # ESLint config
├── .prettierrc                # Prettier config
├── index.html                 # HTML principal
├── package.json               # Dependências
├── tsconfig.json              # TypeScript config
├── tailwind.config.js         # TailwindCSS config
├── postcss.config.js          # PostCSS config
└── vite.config.ts             # Vite config
```

## Stack Tecnológica

- **Framework**: React 18 + Vite
- **Linguagem**: TypeScript
- **Styling**: TailwindCSS 3.4
- **Animations**: Framer Motion 11
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date**: date-fns

## Design System

### Paleta de Cores (Industrial Dark Theme)
```css
/* Base Colors - Deep Industrial */
--bg-primary: #0B0C10        /* Coal Black */
--bg-secondary: #1F2833      /* Charcoal Gray */
--bg-tertiary: #0D1117       /* GitHub Dark */
--bg-card: rgba(31, 40, 51, 0.85)

/* Accent Colors - Neon Tech */
--accent-cyan: #00FFF0        /* Electric Cyan (Primary) */
--accent-blue: #0A84FF        /* Tech Blue */
--accent-purple: #BF5AF2      /* Neon Purple */
--accent-green: #30D158       /* Terminal Green */
--accent-orange: #FF9F0A      /* Alert Orange */
--accent-red: #FF453A         /* Critical Red */

/* Industrial Accents */
--metal-silver: #C5C6C7       /* Brushed Metal */
--metal-gold: #FFD60A         /* Gold Accent */
--border-glow: rgba(0, 255, 240, 0.3)

/* Gradients - Tech Focused */
--gradient-cyber: linear-gradient(135deg, #00FFF0 0%, #0A84FF 100%)
--gradient-industrial: linear-gradient(135deg, #1F2833 0%, #0B0C10 100%)
--gradient-metal: linear-gradient(135deg, #C5C6C7 0%, #66FCF1 50%, #C5C6C7 100%)
--gradient-alert: linear-gradient(135deg, #FF453A 0%, #FF9F0A 100%)
```

### Tipografia
```
Primary: "SF Pro Display" / "Inter" (Display, Headlines)
Secondary: "IBM Plex Mono" (Data, metrics, code)
Accent: "Orbitron" (Tech headers - usar com moderação)
Body: "Inter" (Texto corrido)
```

## Princípios de Organização

1. **Feature-Based**: Organização por features/domínios para escalabilidade
2. **Reusabilidade**: Componentes genéricos em `/components`, específicos em `/features`
3. **Type Safety**: TypeScript em todos os arquivos
4. **Code Splitting**: Lazy loading de rotas e componentes
5. **Barrel Exports**: index.ts para facilitar imports
6. **Atomic Design**: Componentes organizados do mais básico ao mais complexo

## Próximos Passos

1. Setup do projeto com Vite
2. Instalação das dependências
3. Configuração do TailwindCSS com tema industrial
4. Criação do Design System base
5. Implementação do sistema de rotas
6. Desenvolvimento das primeiras páginas
