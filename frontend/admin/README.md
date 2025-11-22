# SindicoAI Admin - Painel Administrativo

Portal administrativo do SindicoAI para gestão completa do sistema de condomínio.

##  Funcionalidades Implementadas

### Autenticação
- ✅ Login com validação de role (apenas admins)
- ✅ Proteção de rotas privadas
- ✅ Refresh token automático
- ✅ Logout

### Dashboard
- ✅ Métricas em tempo real
  - Total de usuários (moradores, funcionários, admins)
  - Total de reservas e áreas comuns
  - Reservas ativas
  - Novos usuários (últimos 7 dias)
- ✅ Status do sistema
- ✅ Ações rápidas

### Gestão de Usuários
- ✅ Listar todos os usuários
- ✅ Filtrar por tipo (admin, morador, funcionário)
- ✅ Buscar por email, nome ou CPF
- ✅ Criar novo usuário
- ✅ Editar usuário existente
- ✅ Ativar/Desativar usuário
- ✅ Reset de senha

##  Tecnologias

- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Roteamento
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **date-fns** - Date formatting
- **Zustand** - State management (se necessário)

##  Estrutura

```
src/
├── components/
│   ├── ui/                 # Componentes reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   └── Table.tsx
│   ├── layout/             # Layout components
│   │   ├── MainLayout.tsx
│   │   └── Sidebar.tsx
│   └── PrivateRoute.tsx    # Route guard
├── contexts/
│   └── AuthContext.tsx     # Auth state management
├── pages/
│   ├── LoginPage.tsx       # Login
│   ├── DashboardPage.tsx   # Dashboard
│   └── UsersPage.tsx       # User management
├── services/
│   ├── api.ts              # Axios config
│   ├── authService.ts      # Auth API
│   ├── userService.ts      # Users API
│   └── dashboardService.ts # Dashboard metrics
├── types/
│   ├── auth.ts
│   ├── user.ts
│   └── dashboard.ts
├── App.tsx                 # Routes
├── main.tsx                # Entry point
└── index.css               # Global styles
```

##  Como Rodar

1. Instalar dependências:
```bash
npm install --legacy-peer-deps
```

2. Criar arquivo `.env` (copiar de `.env.example`):
```bash
cp .env.example .env
```

3. Rodar em desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em: **http://localhost:3002**

##  Credenciais de Teste

Use um usuário com role `admin` criado pelo backend.

Exemplo (se você populou o banco):
- Email: `admin@condominio.com`
- Senha: `admin123`

##  Design System

O projeto usa um design system **Industrial Tech** com:

- **Cores base**: Coal (#0B0C10), Coal Light (#1F2833)
- **Accent colors**: Cyan (#00FFF0), Tech Blue (#0A84FF), Purple (#AF52DE)
- **Status colors**: Terminal Green, Alert Orange, Critical Red
- **Efeitos**: Neon glow, glassmorphism, holographic cards

##  Próximas Implementações

- [ ] Gestão de Unidades (apartamentos)
- [ ] Gestão de Áreas Comuns
- [ ] Visualização de Reservas (calendário)
- [ ] Notificações em Massa
- [ ] Relatórios e Analytics
- [ ] Configurações do Sistema

##  API Backend

O frontend se conecta ao backend em `http://localhost:8000/api/v1`

Certifique-se de que o backend está rodando antes de usar o admin.

##  Notas

- **Porta**: 3002 (configurada no vite.config.ts)
- **Autenticação**: OAuth2 + JWT com refresh token
- **Validação**: Apenas usuários com `role: 'admin'` podem acessar
- **Design**: Responsivo e otimizado para desktop

---

