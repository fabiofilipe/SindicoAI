#  Plano Final de Projeto: SindicoAI (Versão Definitiva)

Este plano detalha a construção do **SindicoAI** com foco em robustez, escalabilidade e inteligência. As tarefas estão organizadas cronologicamente para garantir que cada passo desbloqueie o próximo.

##  Visão Técnica & Stack
*   **Backend:** Python (FastAPI) ou Node.js (NestJS) - *Containerizado via Docker*.
*   **Banco de Dados:** PostgreSQL (Dados Relacionais + Vetoriais com `pgvector`).
*   **Multi-tenancy:** Isolamento lógico via Row-Level Security (RLS) ou Schemas.
*   **Frontend:** React + Tailwind + Framer Motion (Web) e React Native + Reanimated (Mobile) - *Foco em UX Premium*.
*   **Infraestrutura:** Docker Compose (Dev), Terraform (IaC), RabbitMQ (Filas).
*   **IA:** OpenAI/Anthropic + LangChain + RAG Evaluation (Ragas/DeepEval).

---

##  Fase 1: Fundação Sólida e Design 
**Objetivo:** Configurar o ambiente de desenvolvimento containerizado e definir a estrutura de dados segura.

### 1.1 Setup do Ambiente (Docker)
- [ ] **Configurar Repositório:** Git flow, pre-commit hooks (linting, formatação).
- [ ] **Dockerização Inicial:** Criar `Dockerfile` para Backend e `docker-compose.yml` contendo:
    - API Service
    - PostgreSQL (com extensão `vector` habilitada)
    - Redis (para cache/filas futuras)
    - pgAdmin ou similar.
- [ ] **Hello World:** Endpoint de healthcheck funcionando via Docker.

### 1.2 Modelagem de Dados e Multi-tenancy
- [ ] **Definir Estratégia Multi-tenant:** Decidir e documentar (Recomendado: RLS para simplicidade e escala inicial).
- [ ] **Modelagem ERD Core:**
    - `Tenants` (Condomínios)
    - `Users` (Moradores, Síndicos, Funcionários)
    - `Units` (Apartamentos/Casas)
- [ ] **Migrações:** Configurar Alembic (Python) ou TypeORM/Prisma (Node) para gerenciar schema.

### 1.3 Estruturação do Backend (Clean Architecture)
- [ ] **Organização de Pastas:** Criar estrutura dentro de `backend/app`:
    - `api/routes`: Endpoints da API (separados por módulo).
    - `schemas`: Modelos Pydantic (Request/Response).
    - `models`: Modelos SQLAlchemy (Banco de Dados).
    - `services`: Lógica de negócio complexa.
    - `core/config`: Configurações (Env vars).
    - `core/security`: Utils de Auth (Hash, Token).
    - `dependencies`: Injeção de dependência (Get DB, Get User).
    - `utils`: Funções auxiliares genéricas.
- [ ] **Refatoração:** Mover arquivos existentes para as novas pastas.

### 1.4 Autenticação Base
- [ ] **Dependências:** Adicionar `passlib`, `python-jose`, `python-multipart`.
- [ ] **Implementação:**
    - `core/security.py`: Funções de Hash e JWT.
    - `api/routes/auth.py`: Login e Refresh Token.
    - `dependencies/auth.py`: Middleware de proteção de rotas.

---

##  Fase 2: Backend Core e Infraestrutura 
**Objetivo:** Construir as funcionalidades vitais de gestão e preparar a automação de infraestrutura.

### 2.1 Infraestrutura como Código (IaC)
- [ ] **Setup Terraform/Pulumi:** Criar scripts para provisionar recursos básicos (Bucket S3, Banco de Dados) em ambiente de Staging.
- [ ] **CI/CD Pipeline:** Configurar GitHub Actions para rodar testes unitários e build do Docker a cada Push.

### 2.2 Funcionalidades Core (CRUDs)
- [ ] **Gestão de Áreas Comuns:** CRUD de áreas (Piscina, Salão) com regras de horário.
- [ ] **Reservas:** Lógica de conflito de horários e limites por unidade.
    - *Teste:* Criar testes unitários cobrindo cenários de conflito.
- [ ] **Módulo de Notificações (Backend):** Estrutura para criar e listar notificações.

### 2.3 Importador Universal (Onboarding)
- [ ] **ETL de Importação:** Criar script/endpoint para importar moradores e unidades via CSV/Excel.
    - *Motivo:* Facilitar a entrada de novos condomínios.

---

##  Fase 3: Inteligência Artificial e RAG 
**Objetivo:** Implementar o "cérebro" do sistema com segurança e testes de qualidade.

### 3.1 Infraestrutura Vetorial
- [ ] **Tabela de Documentos:** Tabela para metadados de arquivos (PDFs de regimentos).
- [ ] **Pipeline de Ingestão:**
    - Upload de PDF -> Extração de Texto -> Chunking -> Embedding -> Salvar no Postgres (pgvector).
    - *Importante:* Garantir que cada chunk tenha o `tenant_id` associado.

### 3.2 RAG (Retrieval-Augmented Generation)
- [ ] **Busca Semântica:** Endpoint que recebe pergunta, busca chunks do condomínio específico e retorna contexto.
- [ ] **Geração de Resposta:** Integrar com LLM (OpenAI/Anthropic) para formular a resposta baseada no contexto.

### 3.3 Framework de Avaliação (RAG Eval)
- [ ] **Dataset de Ouro:** Criar 20 pares de Pergunta/Resposta ideais para teste.
- [ ] **Pipeline de Eval:** Implementar script que roda essas perguntas e avalia a precisão da resposta (usando Ragas ou similar) antes de deployar mudanças na IA.

---

##  Fase 4: Frontend e Mobile (Ultra Premium Experience)
**Objetivo:** Criar interfaces deslumbrantes, dinâmicas e responsivas que encantem o usuário ("Wow Effect").

### 4.1 Design System & UX
- [ ] **Estética:** Glassmorphism, gradientes sutis, Dark Mode nativo e tipografia moderna.
- [ ] **Interatividade:** Micro-interações em todos os botões e cards (Framer Motion/Reanimated).
- [ ] **Performance:** Carregamento instantâneo (Skeleton screens, Lazy loading, Otimização de assets).

### 4.2 Web Admin (React)
- [ ] **Setup:** Vite + React + TailwindCSS + Framer Motion.
- [ ] **Dashboard Futurista:** Gráficos em tempo real, widgets arrastáveis, visualização de dados imersiva.
- [ ] **Gestão de Documentos:** Interface drag-and-drop com preview instantâneo e animações de upload.

### 4.3 App do Morador (Mobile)
- [ ] **Setup:** React Native (Expo) com Reanimated.
- [ ] **Chat Imersivo:** Interface estilo "WhatsApp Premium", com respostas em streaming e feedback tátil.
- [ ] **Reservas Visual:** Seleção de áreas com mapas interativos ou carrosséis 3D.

### 4.4 App do Funcionário (Offline-First)
- [ ] **Arquitetura Offline:** Configurar banco local (WatermelonDB ou SQLite).
- [ ] **Sincronização:** Implementar lógica de *sync* transparente e robusta.
- [ ] **UX Focada:** Botões grandes, alto contraste, feedback sonoro/visual para confirmações rápidas.

---

##  Fase 5: Qualidade e Refinamento 
**Objetivo:** Garantir que o sistema aguente o tranco.

### 5.1 Testes de Carga
- [ ] **Locust/k6:** Criar scripts para simular 1000 usuários simultâneos fazendo reservas e perguntas à IA.
- [ ] **Otimização:** Ajustar índices do banco e réplicas do Docker baseado nos resultados.

### 5.2 Segurança
- [ ] **Pentest Básico:** Rodar ferramentas (ex: OWASP ZAP) para identificar vulnerabilidades comuns.
- [ ] **Auditoria de Dados:** Verificar se o isolamento entre condomínios está 100% funcional.

---

##  Fase 6: Lançamento 
**Objetivo:** Colocar em produção e monitorar.

### 6.1 Deploy Produção
- [ ] **Executar Terraform:** Provisionar ambiente de Prod.
- [ ] **Deploy:** Rodar pipeline de CI/CD para deploy final.

### 6.2 Observabilidade
- [ ] **Monitoramento:** Configurar Prometheus + Grafana para métricas (CPU, Memória, Latência da IA).
- [ ] **Logs:** Centralizar logs para debug rápido.
