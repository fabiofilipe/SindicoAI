#  Fase 4 - Frontend & Mobile (Ultra Premium Industrial Tech)

##  Objetivo
Criar interfaces **ultra premium com design industrial tech-focused** inspiradas em painéis de controle aeroespacial e centros de comando. Visual **cyberpunk clean**, high-tech e futurista para web (admin, morador e funcionário) e posteriormente mobile.

---

##  Arquitetura Frontend

```
frontend/
├── admin/                    # Web Admin (Síndico/Admin)
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/           # Páginas do dashboard
│   │   ├── features/        # Features por módulo
│   │   ├── services/        # API calls
│   │   ├── hooks/           # Custom hooks
│   │   ├── store/           # Zustand/Redux state
│   │   └── styles/          # TailwindCSS + animations
│   └── package.json
│
├── morador/                 # Web Morador (Temporário para testes)
│   └── src/                # Estrutura similar ao admin
│
├── funcionario/             # Web Funcionário (Operacional)
│   └── src/                # Interface simplificada e rápida
│
└── mobile/                  # React Native (Fase 4B - Futuro)
    ├── morador-app/
    └── funcionario-app/
```

---

##  Design System - Ultra Premium Industrial Tech

### Identidade Visual
**Conceito**: Inspiração em **interfaces de controle industrial**, painéis de **comando aeroespacial** e **cyberpunk premium**. Visual clean mas intenso, com elementos high-tech e futuristas.

### Paleta de Cores (Industrial Dark Theme)
```css
/* Base Colors - Deep Industrial */
--bg-primary: #0B0C10        /* Coal Black */
--bg-secondary: #1F2833      /* Charcoal Gray */
--bg-tertiary: #0D1117       /* GitHub Dark */
--bg-card: rgba(31, 40, 51, 0.85)  /* Semi-transparent industrial */

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
--border-glow: rgba(0, 255, 240, 0.3)  /* Cyan glow */

/* Gradients - Tech Focused */
--gradient-cyber: linear-gradient(135deg, #00FFF0 0%, #0A84FF 100%)
--gradient-industrial: linear-gradient(135deg, #1F2833 0%, #0B0C10 100%)
--gradient-metal: linear-gradient(135deg, #C5C6C7 0%, #66FCF1 50%, #C5C6C7 100%)
--gradient-alert: linear-gradient(135deg, #FF453A 0%, #FF9F0A 100%)

/* Grid Lines & Borders */
--grid-color: rgba(0, 255, 240, 0.1)
--border-tech: 1px solid rgba(0, 255, 240, 0.2)
```

### Tipografia
```
Primary: "SF Pro Display" / "Inter" (Display, Headlines)
Secondary: "IBM Plex Mono" (Data, metrics, code)
Accent: "Orbitron" (Tech headers - usar com moderação)
Body: "Inter" (Texto corrido)
```

### Efeitos Visuais Tech
- **Glow Effects**: text-shadow e box-shadow com neon cyan/blue
- **Scan Lines**: Subtle animated scanline overlay
- **Grid Background**: Faint tech grid pattern
- **Holographic Cards**: Semi-transparent com border glow
- **Animated Borders**: Gradientes animados em hover
- **Particle Effects**: Subtle floating particles em backgrounds
- **Terminal Cursor**: Blinking cursor em inputs
- **Data Stream**: Animação de dados fluindo em gráficos

---

##  Mapeamento de Rotas por Role

###  ADMIN/SÍNDICO
```typescript
// Gestão de Condomínio
POST   /api/v1/onboarding              // Criar condomínio
POST   /api/v1/imports/units           // Importar unidades CSV
POST   /api/v1/imports/residents       // Importar moradores CSV

// Gestão de Unidades
GET    /api/v1/units                   // Listar unidades
POST   /api/v1/units                   // Criar unidade
GET    /api/v1/units/{id}              // Detalhes unidade
PUT    /api/v1/units/{id}              // Atualizar unidade
DELETE /api/v1/units/{id}              // Deletar unidade

// Gestão de Usuários
GET    /api/v1/users                   // Listar usuários
GET    /api/v1/users/{id}              // Detalhes usuário
PUT    /api/v1/users/{id}/activate     // Ativar usuário
PUT    /api/v1/users/{id}/deactivate   // Desativar usuário
PUT    /api/v1/users/{id}/reset-password // Reset senha

// Áreas Comuns
GET    /api/v1/common-areas            // Listar áreas
POST   /api/v1/common-areas            // Criar área
PUT    /api/v1/common-areas/{id}       // Atualizar área
DELETE /api/v1/common-areas/{id}       // Deletar área

// Documentos (RAG)
POST   /api/v1/documents/upload        // Upload PDF
GET    /api/v1/documents               // Listar documentos
GET    /api/v1/documents/{id}          // Detalhes documento

// IA e Cache
POST   /api/v1/ai/chat                 // Chat com IA
GET    /api/v1/ai/usage                // Estatísticas uso
GET    /api/v1/ai/cache/stats          // Stats cache
DELETE /api/v1/ai/cache                // Invalidar cache

// Notificações
POST   /api/v1/notifications           // Criar notificação
GET    /api/v1/notifications           // Listar notificações

// Reservas
GET    /api/v1/reservations            // Todas reservas
```

###  MORADOR (RESIDENT)
```typescript
// Autenticação
POST   /api/v1/auth/login              // Login
POST   /api/v1/auth/refresh            // Refresh token
POST   /api/v1/register                // Auto-cadastro (CPF)

// Perfil
GET    /api/v1/users/me                // Meu perfil

// Reservas
GET    /api/v1/reservations            // Minhas reservas
POST   /api/v1/reservations            // Nova reserva
GET    /api/v1/reservations/{id}       // Detalhes reserva
DELETE /api/v1/reservations/{id}       // Cancelar reserva

// Áreas Comuns
GET    /api/v1/common-areas            // Ver áreas disponíveis

// IA
POST   /api/v1/ai/chat                 // Perguntar ao assistente
GET    /api/v1/ai/usage                // Meu uso diário

// Notificações
GET    /api/v1/notifications           // Minhas notificações
PUT    /api/v1/notifications/{id}/read // Marcar como lida
DELETE /api/v1/notifications/{id}      // Deletar notificação
```

###  FUNCIONÁRIO (EMPLOYEE)
```typescript
// Autenticação
POST   /api/v1/auth/login              // Login

// Reservas (Gestão)
GET    /api/v1/reservations            // Ver todas reservas

// Notificações
GET    /api/v1/notifications           // Minhas notificações
```

---

##  FASE 4A-1: Web Admin

### Stack Tecnológica
```json
{
  "framework": "React 18 + Vite",
  "styling": "TailwindCSS 3.4",
  "animations": "Framer Motion 11",
  "state": "Zustand",
  "forms": "React Hook Form + Zod",
  "http": "Axios",
  "routing": "React Router v6",
  "charts": "Recharts",
  "icons": "Lucide React",
  "date": "date-fns"
}
```

### Estrutura de Páginas

#### 1. **Login** (`/login`)
**Design**: Tela dividida - esquerda com gradiente animado, direita com formulário glassmorphism
- Campo email com validação real-time
- Campo senha com toggle visibility
- Botão com loading animation
- Esqueci senha (modal)
- Link para auto-cadastro morador

#### 2. **Dashboard** (`/dashboard`)
**Design**: Grid de cards com glassmorphism e animações de hover
- **Hero Section**: Boas-vindas com horário, clima (API), nome do condomínio
- **Quick Stats** (4 cards):
  - Total de Unidades
  - Moradores Ativos
  - Reservas Hoje
  - Uso IA (Este mês)
- **Gráficos**:
  - Reservas por área (últimos 7 dias)
  - Uso da IA (últimos 30 dias)
- **Timeline Atividades Recentes**

#### 3. **Unidades** (`/units`)
**Design**: Lista com filtros, busca e ações rápidas
- **Header**: Título + botão "Nova Unidade" + busca + filtros (tipo, status)
- **Cards Grid** (ou tabela premium):
  - Número da unidade (destaque)
  - Tipo (Apartamento/Casa/Loja)
  - Área (m²)
  - Moradores associados
  - Status badge (Ocupada/Vaga)
  - Ações: Ver, Editar, Deletar
- **Modal Criar/Editar**: Form com validação

#### 4. **Moradores** (`/users`)
**Design**: Tabela interativa com avatar, status, ações
- **Filtros**: Role, Status (Ativo/Pendente)
- **Colunas**: Avatar, Nome, Email, CPF, Unidade, Role, Status, Ações
- **Ações Rápidas**:
  - Ativar/Desativar usuário
  - Reset senha (gera nova e envia)
  - Ver detalhes

#### 5. **Áreas Comuns** (`/common-areas`)
**Design**: Cards visuais com imagens (placeholders) e status
- **Grid de Cards**: Nome, Descrição, Capacidade, Horários, Status
- **Modal Criar/Editar**: Upload imagem, nome, CNPJ

#### 6. **Reservas** (`/reservations`)
**Design**: Calendário visual + lista
- **Visualização Calendário**: Todas reservas do mês
- **Lista Filtrada**: Por data, área, status
- **Cards Reserva**: Área, Morador, Data/Hora, Status (Confirmada/Cancelada)

#### 7. **Documentos** (`/documents`)
**Design**: Upload zone drag-drop premium com preview
- **Upload Zone**: Área drag-drop com animações
- **Lista Documentos**: Thumbnail PDF, Nome, Data upload, Status processamento
- **Status**: Pending, Processing, Completed, Failed
- **Ações**: Ver, Download, Deletar

#### 8. **Assistente IA** (`/ai`)
**Design**: Interface chat premium estilo ChatGPT
- **Sidebar**: Histórico de conversas (salvos localmente)
- **Main Chat**: Mensagens com markdown support
- **Input**: Textarea expansível, botão enviar com loading
- **Stats Card**: Uso diário (X/50), Cache hits

#### 9. **Notificações** (`/notifications`)
**Design**: Centro de notificações com categorias
- **Tabs**: Todas, Não Lidas, Importantes
- **Lista**: Card por notificação com ícone, mensagem, data
- **Ações**: Marcar lida, Deletar, Marcar todas como lidas
- **Criar**: Modal para enviar notificação broadcast

#### 10. **Importações** (`/imports`)
**Design**: Upload CSV com preview e validação
- **Upload Units**: CSV template download, validação
- **Upload Residents**: Igual acima
- **Preview Table**: Mostra dados antes de importar
- **Logs**: Histórico de importações

#### 11. **Configurações** (`/settings`)
**Design**: Tabs com forms
- **Perfil**: Alterar dados pessoais
- **Segurança**: Trocar senha
- **Condomínio**: Editar dados (nome, CNPJ, endereço)
- **Aparência**: Toggle dark mode, cores accent

---

##  FASE 4A-2: Web Morador

### Estrutura Simplificada

#### 1. **Login/Cadastro** (`/`)
- Interface simplificada e responsiva
- Auto-cadastro com validação CPF

#### 2. **Home** (`/home`)
- **Hero**: Boas-vindas, notificações não lidas
- **Quick Actions**: 
  - Fazer Reserva
  - Perguntar à IA
  - Ver Notificações
- **Próximas Reservas**: Cards das reservas

#### 3. **Reservas** (`/reservations`)
- **Calendário Visual**: Disponibilidade das áreas
- **Formulário Reserva**: Selecionar área, data, horário
- **Minhas Reservas**: Lista com cancelamento

#### 4. **Assistente IA** (`/assistant`)
- Chat limpo e responsivo
- Perguntas sugeridas (chips)
- Histórico local

#### 5. **Notificações** (`/notifications`)
- Lista simples
- Marcar como lida
- Deletar

#### 6. **Perfil** (`/profile`)
- Ver dados
- Alterar senha
- Logout

---

##  FASE 4A-3: Web Funcionário

### Conceito
Interface **ultra-simplificada e operacional** focada em **ação rápida** e **visualização clara**. Design industrial com elementos de **Terminal/Command Center**.

### Stack Tecnológica
```json
{
  "framework": "React 18 + Vite",
  "styling": "TailwindCSS 3.4",
  "animations": "Framer Motion 11 (mínimo)",
  "state": "Zustand",
  "http": "Axios",
  "routing": "React Router v6",
  "icons": "Lucide React"
}
```

### Estrutura de Páginas

#### 1. **Login** (`/`)
**Design**: Interface minimalista tipo terminal
- **Visual**: Fundo dark com grid pattern sutil
- Campo email (large input)
- Campo senha com toggle
- Botão "ACESSAR SISTEMA" (full-width, neon glow)
- Sem opções de cadastro (apenas admin cria funcionários)

#### 2. **Dashboard Operacional** (`/dashboard`)
**Design**: Command Center - cards grandes com ações rápidas
- **Header**: Nome do funcionário + Turno atual + Hora
- **Status Panel**: 
  - Reservas Ativas Hoje (número grande com glow)
  - Próximas Reservas (3h)
  - Notificações Não Lidas
- **Quick Actions Grid** (Cards grandes click):
  -  VER AGENDA DO DIA
  -  NOTIFICAÇÕES
  -  RELATÓRIO RÁPIDO
  -  MEU PERFIL

#### 3. **Agenda do Dia** (`/schedule`)
**Design**: Timeline vertical com horários
- **Filtros Rápidos**: Todas | Próximas 3h | Em Andamento
- **Timeline Cards**:
  ```
  [10:00 - 12:00] PISCINA
  Morador: João Silva (#301)
  Status: [CONFIRMADA] | [EM ANDAMENTO] | [CONCLUÍDA]
  Ações: Marcar Início | Marcar Fim | Ver Detalhes
  ```
- **Visual**: Hora em destaque (neon cyan), card com border glow
- **Notificação**: Badge de "Começando em X min"

#### 4. **Detalhes da Reserva** (`/reservations/:id`)
**Design**: Card centralizado com informações críticas
- **Info Display** (Large text):
  - Nome da Área (Header com ícone)
  - Morador (Nome + Unidade)
  - Horário (Start - End)
  - Status Badge
- **Ações**:
  - Marcar Como Iniciada
  - Marcar Como Concluída
  - Reportar Problema (textarea + enviar)
- **Histórico**: Ultimas ações nesta reserva

#### 5. **Todas as Reservas** (`/reservations`)
**Design**: Lista compacta filterable
- **Filtros**: Hoje | Amanhã | Esta Semana
- **Status Filter**: Todas | Confirmadas | Em Andamento | Concluídas
- **Lista Cards**: Info resumida + status badge
- Click para ver detalhes

#### 6. **Notificações** (`/notifications`)
**Design**: Lista tipo inbox
- **Badge Counter**: Não lidas (header)
- **Tabs**: Todas | Não Lidas
- **Cards Notificação**:
  - Ícone de categoria
  - Título (bold)
  - Mensagem (truncated)
  - Data/Hora
  - Botão "Marcar como Lida"
- **Ação em Massa**: "Marcar Todas Como Lidas"

#### 7. **Perfil** (`/profile`)
**Design**: Simple settings
- **Info Display**: Nome, Email, Role (Employee)
- **Ações**:
  - Alterar Senha
  - Logout (botão destaque)

---

### Princípios de Design para Funcionário

1. **Escala Visual Ampliada**
   - Fontes grandes (mínimo 16px body, 24px+ headlines)
   - Botões grandes (min-height 48px) para touch
   - Espaçamento generoso

2. **Alto Contraste**
   - Texto sempre com contrast ratio > 7:1
   - Status badges com cores vibrantes e claras
   - Neon glow em elementos interativos

3. **Feedback Imediato**
   - Loading states visuais óbvios
   - Success/Error toasts grandes
   - Confirmações com modal (ações críticas)

4. **Navegação Simples**
   - Bottom navigation ou sidebar com ícones grandes
   - Breadcrumb sempre visível
   - Voltar sempre disponível

5. **Dados Essenciais Apenas**
   - Sem gráficos complexos
   - Números grandes e claros
   - Listas simples e escaneáveis

---

##  Componentes Reutilizáveis

### Design System Components (Industrial Tech)
```typescript
// Layout
<DashboardLayout variant="admin|morador|funcionario" />
<PageHeader title icon actions glowEffect />
<Card variant="holographic|solid|terminal" borderGlow />
<GridBackground pattern="tech|scan|dots" />

// Forms (Tech Style)
<Input variant="neon|terminal|glass" glowOnFocus />
<Select variant="dropdown|tech" />
<DatePicker theme="industrial" />
<FileUpload 
  dragDrop 
  scanAnimation  // Linha de scan ao processar
  glowBorder 
/>
<Textarea variant="terminal" monospace />

// Feedback
<Toast variant="success|error|warning|info" neonGlow />
<Modal 
  variant="centered|fullscreen" 
  backdropBlur 
  borderGlow 
/>
<LoadingSpinner variant="orbital|pulse|scan|dataStream" />
<Badge 
  variant="success|warning|error|active|inactive" 
  neonGlow 
  pulse 
/>
<ProgressBar animated gradient="cyber|industrial" />

// Data Display
<Table 
  sortable 
  filterable 
  variant="tech|holographic"
  glowRows  // Hover com neon glow
/>
<Chart 
  type="line|bar|pie|area" 
  theme="industrial"
  animated  // Data stream effect
  glowLines 
/>
<DataCard 
  value={number}
  label={string}
  trend="up|down|stable"
  glowOnHover
  size="sm|md|lg|xl"  // XL para funcionário
/>
<Avatar 
  size="sm|md|lg" 
  borderGlow 
  status="online|offline|busy" 
/>
<StatusBadge 
  status="active|pending|completed|cancelled"
  neonColor
  pulse  // Para status "em andamento"
/>

// Navigation
<Sidebar 
  variant="admin|employee" 
  collapsible 
  glowActive 
/>
<Navbar transparent glassEffect />
<Breadcrumb glowSeparator />
<BottomNav icons={[]} variant="employee" />  // Para funcionário

// IA Components
<ChatMessage 
  role="user|assistant" 
  variant="terminal|bubble"
  markdown 
/>
<ChatInput 
  placeholder="Digite sua pergunta..."
  terminalCursor  // Cursor piscante
  glowOnFocus
/>
<SuggestedQuestions chips={[]} />

// Tech Specific
<ScanLine />  // Linha de scan animada
<ParticleBackground density="low|medium|high" />
<NeonText color="cyan|blue|purple|green" />
<GlitchText text={string} />  // Efeito glitch ocasional
<DataStream direction="horizontal|vertical" />
<HologramCard>
  {children}
</HologramCard>
```

### Animações Customizadas (Framer Motion)
```typescript
// Glow Pulse
const glowPulse = {
  boxShadow: [
    '0 0 5px rgba(0, 255, 240, 0.5)',
    '0 0 20px rgba(0, 255, 240, 0.8)',
    '0 0 5px rgba(0, 255, 240, 0.5)'
  ],
  transition: { duration: 2, repeat: Infinity }
}

// Scan Line
const scanLine = {
  y: [0, '100%'],
  transition: { duration: 3, repeat: Infinity, ease: 'linear' }
}

// Holographic Shimmer
const shimmer = {
  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
  transition: { duration: 3, repeat: Infinity }
}

// Data Stream
const dataStream = {
  opacity: [0, 1, 0],
  y: [-20, 0, 20],
  transition: { duration: 1.5, repeat: Infinity, staggerChildren: 0.1 }
}
```

---

##  Implementação - Cronograma

###  1: Setup e Fundação (Industrial Tech Base)
- [ ] Setup Vite + React + TypeScript (Admin)
- [ ] Configurar TailwindCSS customizado (paleta industrial tech)
- [ ] Configurar Framer Motion (glow effects, scan lines)
- [ ] Setup Zustand stores (auth, user, notifications)
- [ ] Criar Design System base (Industrial theme components)
- [ ] Implementar React Router v6
- [ ] Setup Axios interceptors
- [ ] Grid background pattern + effects

###  2: Admin - Core Features
- [ ] Página Login (terminal-style with neon glow)
- [ ] Layout Dashboard com sidebar (industrial design)
- [ ] Dashboard Homepage (stats com data stream effects)
- [ ] Gestão Unidades - Listar (holographic cards)
- [ ] Gestão Unidades - CRUD completo
- [ ] Gestão Usuários - Listar (tech table)
- [ ] Gestão Usuários - Ativar/Desativar/Reset

###  3: Admin - Features Avançadas
- [ ] Áreas Comuns - CRUD completo
- [ ] Sistema Reservas - Calendário visual (tech grid)
- [ ] Sistema Reservas - Criar/Cancelar
- [ ] Upload Documentos - Drag & drop (with scan animation)
- [ ] Chat IA - Interface premium (terminal-style)
- [ ] Notificações - Centro de notificações (inbox industrial)
- [ ] Importações CSV - Upload e preview

###  4: Morador Web + Funcionário Web
- [ ] **Morador**: Setup projeto
- [ ] **Morador**: Login/Cadastro (responsive tech theme)
- [ ] **Morador**: Home Page
- [ ] **Morador**: Reservas Interface
- [ ] **Morador**: Chat IA
- [ ] **Morador**: Notificações
- [ ] **Morador**: Perfil
- [ ] **Funcionário**: Setup projeto
- [ ] **Funcionário**: Login (terminal minimal)
- [ ] **Funcionário**: Dashboard Operacional
- [ ] **Funcionário**: Agenda do Dia
- [ ] **Funcionário**: Notificações

###  5: Polish & Optimization
- [ ] Animações finais (glow effects, scan lines, particles)
- [ ] Responsividade 100% (mobile, tablet, desktop)
- [ ] Testes E2E (Cypress/Playwright)
- [ ] Otimização de bundle (code splitting, lazy loading)
- [ ] Lighthouse > 90 (all platforms)
- [ ] Documentação de componentes (Storybook)
- [ ] Refatoração final (performance tuning)

---

##  Checklist de Qualidade

### UX/UI
- [ ] Todas as transições suaves (< 300ms)
- [ ] Feedback visual para toda ação
- [ ] Loading states em requests
- [ ] Error boundaries implementados
- [ ] Toast notifications funcionando
- [ ] Dark mode perfeito

### Performance
- [ ] Lazy loading de rotas
- [ ] Código splitting
- [ ] Imagens otimizadas
- [ ] Bundle size < 500KB

### Acessibilidade
- [ ] Keyboard navigation
- [ ] ARIA labels
- [ ] Contrast ratio WCAG AA

---

##  FASE 4B: Mobile Apps (Futuro)

### Morador App (React Native + Expo)
- Design premium adaptado para mobile
- Offline-first para notificações
- Push notifications
- Biometria para login

### Funcionário App (React Native + Expo)
- Interface simplificada
- Sync offline (WatermelonDB)
- Scanner QR Code

---

##  Métricas de Sucesso

- [ ] Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Lighthouse Score > 90
- [ ] 100% das funcionalidades do backend integradas
- [ ] Zero bugs críticos
- [ ] Feedbacks "Wow" dos usuários

---

**Próximos Passos**: Começar setup do projeto Admin Web com design system premium! 🚀
