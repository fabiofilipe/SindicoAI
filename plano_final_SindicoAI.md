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
- [x] **Configurar Repositório:** Git flow, pre-commit hooks (linting, formatação).
- [x] **Dockerização Inicial:** Criar `Dockerfile` para Backend e `docker-compose.yml` contendo:
    - API Service
    - PostgreSQL (com extensão `vector` habilitada)
    - Redis (para cache/filas futuras)
    - pgAdmin ou similar.
- [x] **Hello World:** Endpoint de healthcheck funcionando via Docker.

### 1.2 Modelagem de Dados e Multi-tenancy
- [x] **Definir Estratégia Multi-tenant:** Decidir e documentar (Recomendado: RLS para simplicidade e escala inicial).
- [x] **Modelagem ERD Core:**
    - `Tenants` (Condomínios)
    - `Users` (Moradores, Síndicos, Funcionários)
    - `Units` (Apartamentos/Casas)
- [x] **Migrações:** Configurar Alembic (Python) ou TypeORM/Prisma (Node) para gerenciar schema.

### 1.3 Estruturação do Backend (Clean Architecture)
- [x] **Organização de Pastas:** Criar estrutura dentro de `backend/app`:
    - `api/routes`: Endpoints da API (separados por módulo).
    - `schemas`: Modelos Pydantic (Request/Response).
    - `models`: Modelos SQLAlchemy (Banco de Dados).
    - `services`: Lógica de negócio complexa.
    - `core/config`: Configurações (Env vars).
    - `core/security`: Utils de Auth (Hash, Token).
    - `dependencies`: Injeção de dependência (Get DB, Get User).
    - `utils`: Funções auxiliares genéricas.
- [x] **Refatoração:** Mover arquivos existentes para as novas pastas.

### 1.4 Autenticação Base
- [x] **Dependências:** Adicionar `passlib`, `python-jose`, `python-multipart`.
- [x] **Implementação:**
    - `core/security.py`: Funções de Hash e JWT.
    - `api/routes/auth.py`: Login e Refresh Token.
    - `dependencies/auth.py`: Middleware de proteção de rotas.

---

##  Fase 2: Backend Core e Infraestrutura 
**Objetivo:** Construir as funcionalidades vitais de gestão e preparar a automação de infraestrutura.

### 2.1 Infraestrutura como Código (IaC)
- [x] **Setup Terraform/Pulumi:** Criar scripts para provisionar recursos básicos (Bucket S3, Banco de Dados) em ambiente de Staging.
- [x] **CI/CD Pipeline:** Configurar GitHub Actions para rodar testes unitários e build do Docker a cada Push.

### 2.2 Funcionalidades Core (CRUDs)
- [x] **Gestão de Áreas Comuns:** CRUD de áreas (Piscina, Salão) com regras de horário.
- [x] **Reservas:** Lógica de conflito de horários e limites por unidade.
    - *Teste:* Criar testes unitários cobrindo cenários de conflito.
- [x] **Módulo de Notificações (Backend):** Estrutura para criar e listar notificações.

### 2.3 Importador Universal (Onboarding)
- [x] **ETL de Importação:** Criar script/endpoint para importar moradores e unidades via CSV/Excel.
    - *Motivo:* Facilitar a entrada de novos condomínios.

---

##  Fase 3: Inteligência Artificial e RAG 
**Objetivo:** Implementar o "cérebro" do sistema com segurança, qualidade e controle de custos.

### 3.1 Infraestrutura Vetorial e Modelagem
- [x] **Modelagem de Dados:**
    - Tabela `documents`: Metadados de PDFs (nome, tipo, upload_date, tenant_id, uploaded_by).
    - Tabela `document_chunks`: Texto fragmentado + embeddings vetoriais (chunk_text, embedding vector[768], chunk_index, document_id, tenant_id).
- [x] **Escolha de Modelo de Embedding:** **Google Gemini text-embedding-004** (768 dimensões, gratuito até 1500 req/dia).
- [x] **Framework RAG:** **LangChain** com integração `langchain-google-genai` para orquestração.
- [x] **Estratégia de Chunking:** RecursiveCharacterTextSplitter do LangChain (tamanho: 1000 chars, overlap: 200 chars).

### 3.2 Pipeline de Ingestão de Documentos
- [x] **Endpoint de Upload (Admin Only):** POST `/documents/upload` para enviar PDFs de regimentos.
- [x] **Extração de Texto:** Implementar com pdfplumber ou PyPDF2 (considerar OCR para PDFs escaneados).
- [x] **Processamento Assíncrono:**
    - Chunking do texto extraído.
    - Geração de embeddings via API.
    - Armazenamento no pgvector com `tenant_id`.
- [x] **Validação de Segurança:** Garantir isolamento total entre tenants (chunks nunca vazam entre condomínios).

### 3.3 RAG (Retrieval-Augmented Generation)
- [x] **Endpoint de Chat:** POST `/ai/chat` recebe pergunta do usuário.
- [x] **Busca Semântica:** 
    - Converter pergunta em embedding usando Gemini text-embedding-004.
    - Buscar top-5 chunks mais similares (cosine similarity) do tenant específico via pgvector.
- [x] **Geração de Resposta:** 
    - Integrar com **Google Gemini 2.5 Flash** (rápido, barato, contexto de 1M tokens).
    - Usar LangChain RetrievalQA chain para orquestração.
    - Prompt engineering: incluir contexto dos chunks + pergunta + instruções para citar fontes.
    - Retornar resposta + citações (documento e página de origem).

### 3.4 Framework de Avaliação (RAG Eval)
- [x] **Dataset de Teste:** Criar 20-30 pares de Pergunta/Resposta ideais baseados em casos de uso reais:
    - "Qual o horário de funcionamento da piscina?"
    - "Posso ter animais de estimação?"
    - "Qual a multa por barulho após 22h?"
    - "Como funciona o sistema de reservas?"
- [x] **Pipeline de Avaliação:** Script automatizado usando Ragas ou DeepEval para medir:
    - **Precisão:** Resposta correta vs esperada.
    - **Relevância:** Chunks recuperados contêm informação necessária.
    - **Fidelidade:** Resposta baseada apenas no contexto (sem alucinações).
- [x] **CI/CD Integration:** Rodar avaliação antes de deploy de mudanças na IA.

### 3.5 Controle de Custos e Performance
- [x] **Rate Limiting:** Limitar requisições por usuário/condomínio (ex: 50 perguntas/dia por morador).
- [x] **Cache de Respostas:** Implementar cache Redis para perguntas frequentes idênticas.
- [x] **Métricas de Uso:** 
    - Dashboard de tokens consumidos por tenant.
    - Alertas de custo (threshold mensal).
- [x] **Otimização:** Considerar modelos mais baratos para embeddings e respostas simples.

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
