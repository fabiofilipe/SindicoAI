# SindicoAI Landing Page

Esta é a landing page luxuosa e interativa do SindicoAI. Construí esta aplicação com React, Vite, Tailwind CSS e Framer Motion para criar uma experiência premium de apresentação do produto.

## Características

- Design Cyberpunk/Neon com tema tech usando cyan, azul e efeitos de glow
- Animações premium com Framer Motion para transições suaves e interações luxuosas
- Totalmente responsivo e otimizado para mobile, tablet e desktop
- Performance otimizada com Vite para carregamento rápido
- Suporte para prefers-reduced-motion para acessibilidade

## Seções da Landing Page

Organizei a landing page em 5 seções principais:

1. Hero Section - Logo animado, título principal e CTAs
2. User Type Selection - 3 cards interativos para seleção de perfil (Morador, Síndico, Funcionário)
3. Features Showcase - Grid com 8 recursos principais do SindicoAI
4. About Section - Descrição detalhada do produto e benefícios
5. Footer - Links rápidos, informações de contato e redes sociais

## Tecnologias Utilizadas

- React 19 - Framework UI
- TypeScript - Tipagem estática
- Vite 7 - Build tool
- Tailwind CSS 3 - Estilização
- Framer Motion 11 - Animações
- Lucide React - Ícones
- React Router DOM - Navegação

## Instalação e Execução

Para instalar as dependências:
```bash
npm install
```

Para iniciar o servidor de desenvolvimento na porta 3003:
```bash
npm run dev
```

Para build de produção:
```bash
npm run build
```

Para preview do build de produção:
```bash
npm run preview
```

## Design System

Reutilizei o design system cyberpunk/neon dos outros portais para manter consistência visual:

### Cores
- Base: Coal (#0B0C10), Coal Light (#1F2833)
- Accent: Cyan (#00FFF0), Tech Blue (#0A84FF)
- Status: Terminal Green (#30D158), Alert Orange (#FF9F0A)

### Tipografia
- Sans: Inter, SF Pro Display
- Mono: IBM Plex Mono
- Display: Orbitron

### Efeitos Visuais
- Glowing text e box shadows
- Holographic cards com backdrop blur
- Gradientes cyber (cyan para blue)
- Tech grid background pattern

## Navegação para os Portais

Implementei os seguintes redirecionamentos na landing page:

- Morador: http://localhost:3000/login
- Síndico (Admin): http://localhost:3002/login
- Funcionário: http://localhost:3001/login

Nota: Para testar os redirecionamentos, você precisa ter os 3 portais rodando simultaneamente.

## Estrutura do Projeto

Organizei os arquivos da seguinte forma:

```
src/
├── components/
│   ├── ui/                 # Componentes reutilizáveis
│   ├── layout/             # Layout wrapper
│   └── sections/           # Seções da landing page
├── pages/
│   └── LandingPage.tsx     # Página principal
├── utils/
│   ├── animations.ts       # Variants do Framer Motion
│   └── navigation.ts       # Funções de redirecionamento
├── content/
│   └── copy.ts             # Conteúdo/textos centralizados
├── App.tsx                 # Router
├── main.tsx                # Entry point
└── index.css               # Estilos globais
```

## Animações Implementadas

Implementei diferentes tipos de animações para criar uma experiência luxuosa:

- Hero: Sequência de entrada com logo, título e CTAs
- Scroll-triggered: Seções animam ao entrar na viewport
- Hover effects: Cards com scale e glow aumentado
- Floating: Ícones e orbs com movimento suave contínuo
- Parallax: Elementos se movem em velocidades diferentes no scroll

## Testes

### Checklist Funcional
- Botão "Morador" deve redirecionar para localhost:3000/login
- Botão "Síndico" deve redirecionar para localhost:3002/login
- Botão "Funcionário" deve redirecionar para localhost:3001/login
- CTAs do hero devem fazer scroll suave para as seções
- Links do footer devem funcionar corretamente

### Checklist Visual
- Hero deve exibir corretamente em mobile/tablet/desktop
- Cards devem manter proporção e spacing adequados
- Glowing effects devem renderizar suavemente
- Texto deve ter contraste adequado para leitura

### Checklist de Animação
- Hero animations devem executar em sequência
- Scroll-triggered animations devem ativar corretamente
- Hover effects devem ser suaves (60fps)
- Preferência de reduced motion deve ser respeitada

### Checklist Responsivo
- Mobile (375px): Layout em coluna única
- Tablet (768px): 2 colunas onde apropriado
- Desktop (1440px): Layout completo
- Touch targets devem ter no mínimo 48px em mobile

## Deploy para Produção

Para fazer deploy, execute o build e use a pasta dist gerada:

```bash
npm run build
```

A aplicação pode ser deployada em qualquer serviço de hosting estático como Vercel, Netlify, GitHub Pages, ou AWS S3 + CloudFront.

## Customização

### Alterar Conteúdo
Edite o arquivo `/src/content/copy.ts` para atualizar todos os textos da landing page.

### Alterar Cores
Edite `tailwind.config.js` na seção `theme.extend.colors` para modificar o design system.

### Adicionar Novas Seções
1. Crie um novo componente em `/src/components/sections/`
2. Importe e adicione em `/src/pages/LandingPage.tsx`
3. Adicione o conteúdo em `/src/content/copy.ts` se necessário

## Executar Todos os Portais Simultaneamente

Para testar a integração completa, execute em terminais separados:

```bash
# Terminal 1 - Morador
cd ../morador && npm run dev

# Terminal 2 - Admin
cd ../admin && npm run dev

# Terminal 3 - Funcionário
cd ../funcionario && npm run dev

# Terminal 4 - Landing
cd ../landing && npm run dev
```

Desta forma você terá acesso a:
- Landing: http://localhost:3003
- Morador: http://localhost:3000
- Admin: http://localhost:3002
- Funcionário: http://localhost:3001

## Notas de Implementação

- Copiei os componentes Button e HologramCard do portal morador para manter consistência
- Implementei todos os componentes com TypeScript para type safety
- Centralizei todo o conteúdo em copy.ts para facilitar futuras traduções (i18n)
- Utilizei GPU-accelerated animations (transform e opacity) para performance
- A aplicação é standalone e não depende de APIs ou autenticação
