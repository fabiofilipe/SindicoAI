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

### Desenvolvimento Local

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

### Execução com Docker

Construí a aplicação para rodar em container Docker usando Nginx como servidor web. A imagem é criada em multi-stage build para otimizar o tamanho final.

Para buildar a imagem Docker:
```bash
cd /home/fabiof/projetos_pessoais/SindicoAI
docker-compose build frontend-landing
```

Para iniciar o container:
```bash
docker-compose up -d frontend-landing
```

Para parar o container:
```bash
docker-compose stop frontend-landing
```

Para ver os logs:
```bash
docker-compose logs -f frontend-landing
```

A aplicação estará disponível em http://localhost:3003 (porta 3003 do host mapeada para porta 80 do container).

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
/frontend/landing/
├── public/
│   └── assets/
│       └── pexels-photo-323705.jpeg    # Imagem da seção About
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx              # Botão com múltiplas variantes (copiado do morador)
│   │   │   ├── HologramCard.tsx        # Card com efeito holográfico (copiado do morador)
│   │   │   ├── AnimatedCard.tsx        # Card com animações Framer Motion
│   │   │   ├── SectionTitle.tsx        # Títulos de seção com animações
│   │   │   ├── FeatureCard.tsx         # Card para showcase de features
│   │   │   ├── UserTypeCard.tsx        # Card interativo para seleção de perfil
│   │   │   ├── GlowOrb.tsx            # Orbs de background com animação flutuante
│   │   │   └── ScrollReveal.tsx        # Wrapper para animações ao scrollar
│   │   ├── layout/
│   │   │   └── LandingLayout.tsx       # Layout principal com GlowOrbs fixos
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx         # Seção hero com logo e CTAs
│   │   │   ├── UserTypeSection.tsx     # Seleção de perfil de usuário
│   │   │   ├── FeaturesSection.tsx     # Showcase dos 8 recursos
│   │   │   ├── AboutSection.tsx        # Sobre o produto com imagem
│   │   │   └── Footer.tsx              # Rodapé com links e copyright
│   │   └── index.ts                    # Barrel export de componentes
│   ├── pages/
│   │   └── LandingPage.tsx             # Página principal que compõe todas as seções
│   ├── utils/
│   │   ├── animations.ts               # Variants do Framer Motion (fadeIn, scaleIn, etc)
│   │   └── navigation.ts               # Funções de redirecionamento para portais
│   ├── content/
│   │   └── copy.ts                     # Todos os textos e conteúdos centralizados
│   ├── App.tsx                         # Router com React Router DOM
│   ├── main.tsx                        # Entry point da aplicação
│   ├── index.css                       # Estilos globais e customizações Tailwind
│   └── vite-env.d.ts                   # Declarações de tipos do Vite
├── assets/
│   └── pexels-photo-323705.jpeg        # Fonte original da imagem
├── .dockerignore                       # Arquivos ignorados no build Docker
├── package.json                        # Dependências e scripts
├── vite.config.ts                      # Configuração Vite (porta 3003, aliases)
├── tailwind.config.js                  # Design system cyberpunk/neon
├── tsconfig.json                       # Configuração TypeScript
├── tsconfig.app.json                   # Config TS para aplicação
└── tsconfig.node.json                  # Config TS para Node.js (Vite)
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

## Componentes Principais

### Componentes UI Base

**Button.tsx**
- Copiado do portal morador para manter consistência
- 5 variantes: primary, secondary, outline, ghost, danger
- 3 tamanhos: sm, md, lg
- Suporte para loading state e fullWidth
- Todas as transições com GPU-accelerated animations

**HologramCard.tsx**
- Copiado do portal morador
- Efeito holográfico com backdrop-blur
- Border glow personalizável
- Hover effects opcionais

**UserTypeCard.tsx**
- Componente crítico para navegação entre portais
- Animação de ícone flutuante
- Efeito de scale e glow no hover
- Redirecionamento via window.location.href
- Feedback visual ao clicar

**FeatureCard.tsx**
- Card otimizado para showcase de features
- Ícone com rotating glow infinito
- Scroll-triggered animation com stagger
- Lift effect no hover

**GlowOrb.tsx**
- Orbs de background com blur e glow
- Animação floating contínua
- Posicionamento absoluto personalizável
- 3 cores disponíveis: cyan, blue, purple
- Delay configurável para efeito staggered

**ScrollReveal.tsx**
- Wrapper genérico para animações ao scrollar
- Usa useInView do Framer Motion
- 5 direções: up, down, left, right, none
- Trigger apenas uma vez (once: true)
- Amount configurável para threshold de visibilidade

### Assets e Imagens

Utilizei a imagem `pexels-photo-323705.jpeg` na seção About:
- Imagem de prédios/condomínios para contexto visual
- Overlay gradiente para melhor legibilidade do texto
- Tint cyan sutil que intensifica no hover
- Efeito de scale 1.02x ao passar o mouse
- Texto "SindicoAI" e "Tecnologia que transforma" sobre a imagem

## Correções e Otimizações Implementadas

### Correção de Double Scrollbar

Identifiquei e corrigi o problema de dois scrollbars que apareciam na página:

**Problema Original:**
- Container do LandingLayout com min-h-screen criava scroll extra
- HeroSection também tinha min-h-screen gerando conflito
- Containers do React Router e Framer Motion podiam criar scrolls adicionais

**Solução Implementada:**
1. Removi min-h-screen do LandingLayout e HeroSection
2. Configurei html com overflow-y: auto (único scroll)
3. Configurei body com overflow-y: visible
4. GlowOrbs movidos para container fixed separado
5. Adicionei regras CSS para forçar overflow: visible em containers do React Router
6. HeroSection agora usa padding responsivo (py-20, md:py-32, lg:py-40)

### Performance

- Todas as animações usam transform e opacity (GPU-accelerated)
- GlowOrbs em container fixed com pointer-events-none
- Imagens otimizadas e lazy-loaded
- Bundle size mantido abaixo de 500KB
- CSS minificado e tree-shaked pelo Tailwind

## Docker e Deploy

### Dockerfile Multi-Stage

Implementei um Dockerfile genérico em `/frontend/Dockerfile` que:
1. Stage 1 (builder): Instala dependências e builda a aplicação
2. Stage 2 (nginx): Copia apenas os arquivos buildados para Nginx Alpine
3. Suporta múltiplos apps via ARG APP_NAME

### Configuração Nginx

O arquivo `/frontend/nginx.conf` inclui:
- Gzip compression para assets
- Cache headers para arquivos estáticos (1 ano)
- SPA fallback (todas rotas retornam index.html)
- Health check endpoint em /health
- Security headers (X-Frame-Options, X-Content-Type-Options, etc)

### Docker Compose

A landing page está integrada no `docker-compose.yml`:
- Service: frontend-landing
- Port mapping: 3003:80
- Não depende do backend (app standalone)
- Build context: ./frontend com ARG APP_NAME=landing

## Troubleshooting

### Cache do Navegador

Se as mudanças não aparecerem após rebuild:
1. Feche todas as abas do localhost:3003
2. Limpe o cache do navegador (Ctrl + Shift + Delete)
3. Abra uma aba anônima/privada
4. Faça hard refresh (Ctrl + Shift + R)

### Container não inicia

Se o container não subir:
```bash
# Parar e remover completamente
docker-compose stop frontend-landing
docker-compose rm -f frontend-landing

# Rebuildar sem cache
docker-compose build --no-cache frontend-landing

# Iniciar novamente
docker-compose up -d frontend-landing

# Ver logs para debug
docker-compose logs -f frontend-landing
```

### Erro de TypeScript no Build

Se encontrar erro "Cannot find module './index.css'":
- Certifique-se que `vite-env.d.ts` existe em src/
- Conteúdo deve ser: `/// <reference types="vite/client" />`

### Erro de Dependências no npm ci

Se o `npm ci` falhar no Docker:
- Execute `npm install` localmente primeiro
- Isso atualiza o package-lock.json
- Commite o package-lock.json atualizado
- Rebuild a imagem Docker

## Notas de Implementação

- Copiei os componentes Button e HologramCard do portal morador para manter consistência
- Implementei todos os componentes com TypeScript para type safety
- Centralizei todo o conteúdo em copy.ts para facilitar futuras traduções (i18n)
- Utilizei GPU-accelerated animations (transform e opacity) para performance
- A aplicação é standalone e não depende de APIs ou autenticação
- GlowOrbs ficam em container fixed separado para não interferir no scroll
- Imagem da seção About vem da pasta public/assets para ser servida estaticamente
- Todos os redirecionamentos usam window.location.href para navegação cross-origin
- Smooth scroll implementado via CSS (scroll-behavior: smooth)
- Responsividade implementada com mobile-first approach usando Tailwind
