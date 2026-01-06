# 🗺️ Roadmap de Tarefas Pendentes - SindicoAI

**Atualizado em:** 06/01/2026
**Status do Projeto:** ~85% Completo

---

## 📊 Visão Geral do Progresso

### ✅ Fases Completas (100%)
- ✅ **Fase 1:** Fundação Sólida e Design
- ✅ **Fase 2:** Backend Core e Infraestrutura
- ✅ **Fase 3:** Inteligência Artificial e RAG

### 🟡 Fases Parciais (50-90%)
- 🟡 **Fase 4:** Frontend e Mobile (85% - Web completo, Mobile pendente)
- 🟡 **Fase 5:** Qualidade e Refinamento (40% - Testes básicos, falta carga e segurança)

---

## 🎯 SPRINT 1 - Melhorias de UX/UI
**Prioridade:** 🔴 CRÍTICA | **Status:** 0%

### 1.1 Framer Motion Integration
- [ ] **Instalar framer-motion nos 3 frontends Web**
  - Admin, Morador e Funcionário
  - Comando: `npm install framer-motion`

- [ ] **Implementar micro-interações em botões e cards**
  - Hover effects suaves
  - Click feedback (scale, haptic)
  - Drag animations (áreas drag-and-drop)

- [ ] **Adicionar animações de transição entre páginas**
  - Fade in/out ou slide transitions
  - Configurar AnimatePresence
  - Tempo de transição: 200-300ms

- [ ] **Criar feedback visual em ações**
  - Loading states animados
  - Success/Error toast notifications
  - Skeleton screens para carregamento

### 1.2 Progressive Web App (PWA)
- [ ] **Implementar Service Workers para cache offline**
  - Criar `service-worker.js`
  - Cache de assets estáticos (CSS, JS, imagens)
  - Cache de rotas principais
  - Estratégia: Cache-First para assets, Network-First para API

- [ ] **Configurar Manifest.json para instalação**
  - Configurar `manifest.json` em cada frontend
  - Definir ícones (192x192, 512x512)
  - Splash screens para iOS/Android
  - Theme color e background color

- [ ] **Implementar Push Notifications (Web)**
  - Solicitar permissão do usuário
  - Integrar com backend (subscription management)
  - Notificações de reservas aprovadas/canceladas
  - Novas mensagens do síndico

### 1.3 Dark/Light Mode Toggle
- [ ] **Criar versão Light dos 3 frontends**
  - Definir paleta de cores Light
  - Atualizar Tailwind config (dark mode: 'class')
  - Criar CSS variables para ambos os temas

- [ ] **Persistir preferência do usuário**
  - LocalStorage ou Context API
  - Hook useTheme() personalizado
  - Inicializar com preferência do sistema (prefers-color-scheme)

- [ ] **Adicionar animação de transição entre temas**
  - Smooth transition (color interpolation)
  - Toggle button com animação (sol/lua)

---

## 🔧 SPRINT 2 - Funcionalidades Essenciais
**Prioridade:** 🔴 ALTA | **Status:** 0%

### 2.1 Recuperação de Senha
**Backend:**
- [ ] **Criar modelo de token de reset**
  - Tabela `password_reset_tokens` (user_id, token, expires_at)
  - Expiração: 1 hora

- [ ] **Implementar Endpoint: POST `/auth/forgot-password`**
  - Receber email do usuário
  - Gerar token único (UUID)
  - Enviar email com link de reset
  - Rate limiting: 3 tentativas/hora por IP

- [ ] **Implementar Endpoint: POST `/auth/reset-password`**
  - Receber token + nova senha
  - Validar token (existe + não expirado)
  - Atualizar senha (hash bcrypt)
  - Invalidar token após uso

**Frontend:**
- [ ] **Criar página "Esqueci minha senha"**
  - Formulário com campo email
  - Mensagem de sucesso
  - Link no login page

- [ ] **Criar página "Resetar senha"**
  - Formulário com nova senha + confirmação
  - Validação de força da senha
  - Redirect para login após sucesso

### 2.2 Notificações Agendadas
**Backend:**
- [ ] **Adicionar campo na tabela notifications**
  - `scheduled_for TIMESTAMP NULL`
  - `sent_at TIMESTAMP NULL`
  - `status ENUM('scheduled', 'sent', 'failed')`

- [ ] **Configurar Celery ou APScheduler**
  - Instalar: `pip install celery redis` ou `apscheduler`
  - Configurar broker (Redis)
  - Task: verificar e enviar notificações pendentes a cada minuto

- [ ] **Criar Endpoint: POST `/admin/notifications/schedule`**
  - Criar notificação com data futura
  - Validar data (> now)

**Frontend (Admin):**
- [ ] **Desenvolver interface de agendamento**
  - Datetime picker
  - Preview da notificação
  - Lista de notificações agendadas

### 2.3 Audit Log Completo
**Backend:**
- [ ] **Criar tabela audit_logs**
  ```sql
  CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    tenant_id INT REFERENCES tenants(id),
    action VARCHAR(50), -- CREATE, UPDATE, DELETE
    entity_type VARCHAR(100), -- User, Reservation, Document
    entity_id INT,
    changes JSONB, -- Before/After values
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT NOW()
  );
  ```

- [ ] **Criar middleware de auditoria**
  - Interceptar POST/PUT/DELETE requests
  - Capturar dados antes/depois
  - Salvar em audit_logs
  - Ignorar endpoints de leitura (GET)

- [ ] **Implementar Endpoint: GET `/admin/audit-logs`**
  - Filtros: user_id, entity_type, action, date_range
  - Paginação (50 por página)
  - Ordenação: timestamp DESC

**Frontend (Admin):**
- [ ] **Criar página de Audit Logs**
  - Tabela com: Data, Usuário, Ação, Entidade, Mudanças
  - Filtros avançados
  - Export para CSV
  - Visualização de diff (before/after)

### 2.4 WebSocket para Notificações em Tempo Real
**Backend:**
- [ ] **Instalar dependência**
  - `pip install python-socketio` ou `fastapi-websockets`
  - Configurar CORS para WebSocket

- [ ] **Criar endpoint WebSocket**
  - `/ws/notifications` (autenticado via token)
  - Manter conexão por usuário
  - Broadcast de notificações novas

- [ ] **Integrar com sistema de notificações**
  - Ao criar notificação, enviar via WebSocket
  - Fallback para polling se WebSocket falhar

**Frontend:**
- [ ] **Instalar socket.io-client**
  - `npm install socket.io-client`

- [ ] **Criar Hook useNotifications()**
  - Conectar ao WebSocket
  - Listener para novas notificações
  - Atualizar estado global (Context/Redux)
  - Mostrar toast notification

- [ ] **Implementar badge de notificações não lidas**
  - Contador em tempo real
  - Marcar como lida ao clicar

---

## 🧪 SPRINT 3 - Testes de Qualidade
**Prioridade:** 🟡 ALTA | **Status:** 20%

### 3.1 Aumentar Cobertura de Testes Backend
- [ ] **Configurar pytest-cov**
  - `pip install pytest-cov`
  - Adicionar ao `pytest.ini`

- [ ] **Escrever Unit Tests para Services (>80% coverage)**
  - `services/auth_service.py`: Login, register, hash password
  - `services/reservation_service.py`: Conflito de horários, limites
  - `services/ai_service.py`: RAG, embeddings, chunking
  - `services/notification_service.py`: Criar, enviar, agendar

- [ ] **Escrever Integration Tests para Rotas Críticas**
  - POST `/auth/login` (sucesso, credenciais inválidas)
  - POST `/reservations` (criar, conflito, limite excedido)
  - POST `/ai/chat` (resposta válida, citações)
  - POST `/documents/upload` (PDF válido, isolamento multi-tenant)
  - GET `/admin/users` (autorização, filtros)

- [ ] **Gerar relatório de coverage**
  - `pytest --cov=app --cov-report=html`
  - Meta: >70% coverage
  - Revisar áreas não cobertas

### 3.2 Testes E2E Frontend
- [ ] **Instalar Cypress ou Playwright**
  - Escolher: Cypress (mais fácil) ou Playwright (mais rápido)
  - `npm install -D @playwright/test`

- [ ] **Configurar ambiente de testes**
  - Base URL de teste
  - Seed database com dados de teste
  - Cleanup após cada teste

- [ ] **Escrever Testes Críticos - Admin**
  - Login como admin
  - Criar novo usuário
  - Editar usuário existente
  - Deletar usuário
  - Upload de documento PDF
  - Aprovar/rejeitar reserva
  - Criar notificação agendada

- [ ] **Escrever Testes Críticos - Morador**
  - Login como morador
  - Ver áreas disponíveis
  - Criar reserva (sucesso)
  - Tentar criar reserva com conflito (erro)
  - Cancelar reserva própria
  - Chat IA: fazer pergunta e receber resposta
  - Ver notificações

- [ ] **Escrever Testes Críticos - Funcionário**
  - Login como funcionário
  - Ver agenda do dia
  - Iniciar reserva (check-in)
  - Concluir reserva (check-out)
  - Reportar problema

- [ ] **Integrar com CI/CD**
  - Rodar E2E no GitHub Actions
  - Screenshots de falhas
  - Vídeo de execução

### 3.3 Testes de Carga (Load Testing)
- [ ] **Instalar Locust ou k6**
  - Escolher: Locust (Python) ou k6 (Go, mais performático)
  - `pip install locust`

- [ ] **Criar Script 1: Login simultâneo**
  - 100 usuários fazendo login ao mesmo tempo
  - Duração: 5 minutos
  - Medir: P50, P95, P99 latency
  - Meta: P95 < 500ms

- [ ] **Criar Script 2: Criação de reservas**
  - 50 usuários criando reservas concorrentes
  - Verificar integridade de conflitos
  - Nenhuma reserva duplicada no mesmo horário
  - Meta: P95 < 1s

- [ ] **Criar Script 3: Chat IA**
  - 20 perguntas simultâneas ao RAG
  - Medir tempo de resposta da IA
  - Verificar isolamento multi-tenant
  - Meta: P95 < 5s

- [ ] **Identificar bottlenecks**
  - Analisar slow queries (PostgreSQL slow log)
  - Verificar uso de CPU/Memória
  - Otimizar índices do banco
  - Considerar connection pooling

- [ ] **Gerar relatório de Load Testing**
  - Gráficos de latência
  - Taxa de erro
  - Throughput (req/s)
  - Recomendações de otimização

---

## 🔒 SPRINT 4 - Segurança e Compliance
**Prioridade:** 🟠 MÉDIA | **Status:** 60%

### 4.1 Pentest Básico
- [ ] **Executar OWASP ZAP Automated Scan**
  - Instalar OWASP ZAP
  - Rodar spider + active scan
  - Gerar relatório HTML

- [ ] **Realizar verificações manuais**
  - **SQL Injection:** Testar inputs maliciosos
  - **XSS:** Injetar scripts em formulários
  - **CSRF:** Verificar tokens CSRF
  - **Broken Authentication:** Teste de session fixation
  - **Sensitive Data Exposure:** JWT não exposto, HTTPS

- [ ] **Testar Rate Limiting**
  - Endpoint `/auth/login`: Max 5 tentativas/minuto
  - Endpoint `/ai/chat`: Max 50/dia por usuário
  - Verificar bloqueio por IP

- [ ] **Validar Autorização**
  - Morador não pode acessar `/admin/*`
  - Funcionário não pode deletar reservas
  - Usuário de Tenant A não vê dados de Tenant B

- [ ] **Corrigir vulnerabilidades encontradas**
  - Priorizar CRITICAL e HIGH
  - Re-testar após correções

### 4.2 Auditoria de Multi-tenancy
- [ ] **Criar script de Auditoria Automatizado**
  - Verificar todas as tabelas com `tenant_id`
  - Garantir queries sempre incluem `WHERE tenant_id = ?`
  - Listar endpoints sem filtro de tenant

- [ ] **Executar testes de Vazamento de Dados**
  - Criar 2 tenants de teste (A e B)
  - Usuário de A tenta acessar recurso de B via ID forçado
  - Verificar: Reservas, Documentos, Usuários, Notificações

- [ ] **Revisar RLS (Row Level Security)**
  - Se usando RLS PostgreSQL, testar políticas
  - Verificar `SET app.current_tenant_id = ?`
  - Garantir que RLS não pode ser bypassado

- [ ] **Documentar Isolamento**
  - README sobre estratégia multi-tenant
  - Checkpoints de segurança para novos endpoints

### 4.3 LGPD/GDPR Compliance
- [ ] **Criar Política de Privacidade**
  - Página `/privacy-policy`
  - O que coletamos, como usamos, compartilhamos
  - Direitos do usuário (acesso, correção, exclusão)

- [ ] **Criar Termo de Uso**
  - Página `/terms-of-service`
  - Regras de uso da plataforma
  - Limitações de responsabilidade

- [ ] **Implementar Feature: Exportar Meus Dados**
  - Endpoint: GET `/user/export-data`
  - Retornar JSON com todos os dados do usuário
  - Formato legível e estruturado

- [ ] **Implementar Feature: Deletar Minha Conta**
  - Endpoint: DELETE `/user/delete-account`
  - Confirmação obrigatória (senha + checkbox)
  - Soft delete ou hard delete (decidir)
  - Anonimizar dados em vez de deletar (GDPR compliant)

- [ ] **Implementar Consent Management**
  - Banner de cookies (se usar analytics)
  - Opt-in para notificações push
  - Opt-in para emails promocionais

---

## 🌟 SPRINT 5 - Features Futuras (Opcional)
**Prioridade:** 🟢 BAIXA | **Status:** 0%

### 5.1 Mobile Apps (React Native)
#### App Morador Mobile
- [ ] Setup React Native + Expo
- [ ] Implementar funcionalidades Core (Login, Reservas, Chat IA, Notificações)
- [ ] Adicionar features Mobile-Specific (Biometria, Push, QR Code, Offline)

#### App Funcionário Mobile
- [ ] Setup React Native + Expo
- [ ] Desenvolver Dashboard e Gestão de Reservas
- [ ] Implementar Offline-First com sincronização

### 5.2 Features Avançadas
- [ ] **Desenvolver Dashboard de Métricas de IA**
  - Perguntas mais frequentes
  - Tokens consumidos e custo
  - Taxa de satisfação

- [ ] **Implementar Sistema de Votação/Assembleias**
  - Criar enquetes e votações
  - Resultado em tempo real
  - Ata digital automática

- [ ] **Desenvolver Gestão Financeira**
  - CRUD de despesas/receitas
  - Relatórios financeiros
  - Integração bancária (OFX)

- [ ] **Criar Marketplace de Fornecedores**
  - Lista de prestadores
  - Avaliações de moradores
  - Agendamento online

- [ ] **Implementar Chat entre Moradores**
  - Mensagens diretas
  - Grupos por bloco
  - Moderação

---

## 🚀 SPRINT 6 - Deploy e Produção
**Prioridade:** 🔵 DEPLOY (Último) | **Status:** 0%

### 6.1 Infraestrutura Base
- [ ] **Escolher e Configurar VPS/Cloud**
  - Opções: AWS EC2, DigitalOcean, Hetzner, Linode
  - Specs mínimas: 4GB RAM, 2 vCPU, 80GB SSD
  - SO: Ubuntu 22.04 LTS

- [ ] **Configurar Domain e DNS**
  - Registrar domínio (ex: sindicoai.com.br)
  - DNS A records para VPS
  - Subdomínios (api, admin, morador, funcionario)

- [ ] **Configurar SSL/HTTPS com Let's Encrypt**
  - Instalar certbot
  - Gerar certificados SSL
  - Configurar nginx para HTTPS
  - Auto-renewal

### 6.2 Docker em Produção
- [ ] **Otimizar docker-compose para Produção**
  - Criar `docker-compose.prod.yml`
  - Restart policies (always)
  - Resource limits (CPU/Memory)
  - Health checks

- [ ] **Configurar Nginx Reverso**
  - Proxy para backend API
  - Servir frontends estáticos
  - Rate limiting
  - Gzip compression

### 6.3 Segredos e Variáveis
- [ ] **Criar .env.production**
  - Database credentials (fortes)
  - JWT secret keys (únicos)
  - API keys da Google (Gemini)
  - Redis password
  - CORS origins

- [ ] **Configurar Vault/Secret Management**
  - HashiCorp Vault ou AWS Secrets Manager
  - Rotação automática de senhas

### 6.4 CI/CD Avançado
- [ ] **Melhorar GitHub Actions Workflow**
  - Build automático em push para main
  - Deploy automático para staging
  - Deploy manual para produção (approval)
  - Rollback automático em falha

- [ ] **Configurar Pipeline de Deploy**
  - SSH para VPS
  - Pull latest images
  - Run migrations (Alembic)
  - Restart containers (zero-downtime)
  - Health check pós-deploy

### 6.5 Backups e Disaster Recovery
- [ ] **Configurar Backup Automatizado do PostgreSQL**
  - Cron job diário (3AM)
  - Retenção: 7 diários, 4 semanais, 3 mensais
  - Upload para S3 ou storage remoto
  - Script de restore testado

- [ ] **Configurar Backup de Uploads (PDFs)**
  - Sincronizar `/uploads` para S3
  - Backup incremental diário

### 6.6 Observabilidade
- [ ] **Configurar Prometheus + Grafana**
  - Métricas de CPU/Memory/Disk
  - Request rate, Error rate
  - P95/P99 latency
  - Tokens consumidos IA (custo)

- [ ] **Implementar Logging Centralizado**
  - ELK Stack ou Loki + Promtail
  - Logs estruturados (JSON)
  - Níveis: DEBUG, INFO, WARNING, ERROR, CRITICAL

- [ ] **Configurar Alertas Automáticos**
  - CPU >80% por 5min
  - Memória >90%
  - Error rate >5%
  - API down
  - Canais: Email, Slack, Telegram

- [ ] **Criar Health Checks Avançados**
  - GET `/health` (basic)
  - GET `/health/detailed` (check DB, Redis, IA)
  - Uptime monitoring (UptimeRobot)

---

## 📈 Métricas de Progresso Atualizadas

| Sprint | Categoria | Tarefas | Concluído | % |
|--------|-----------|---------|-----------|---|
| **Sprint 1** | UX/UI | 15 | 0 | 0% |
| **Sprint 2** | Funcionalidades | 18 | 0 | 0% |
| **Sprint 3** | Testes | 24 | 2 | 8% |
| **Sprint 4** | Segurança | 15 | 0 | 0% |
| **Sprint 5** | Futuro | 20+ | 0 | 0% |
| **Sprint 6** | Produção | 25 | 0 | 0% |
| **TOTAL** | | ~117 | 2 | ~2% |

---

## 🎯 Meu Plano de Execução

### ✅ **Sprint 1: UX/UI**
Vou implementar Framer Motion em todos os frontends, criar PWA setup básico e adicionar dark/light mode toggle.
**Resultado:** Aplicação com cara de produto premium

### ✅ **Sprint 2: Funcionalidades Essenciais**
Vou desenvolver recuperação de senha, notificações agendadas, audit log completo e WebSocket para tempo real.
**Resultado:** Features críticas implementadas

### ✅ **Sprint 3: Qualidade e Testes**
Vou aumentar cobertura de testes para >70%, implementar testes E2E com Playwright e executar testes de carga com Locust.
**Resultado:** Confiança na estabilidade do sistema

### ✅ **Sprint 4: Segurança**
Vou realizar pentest com OWASP ZAP, executar auditoria de multi-tenancy e garantir LGPD compliance.
**Resultado:** Sistema seguro e compliant

### 🚀 **Sprint 6: Deploy em Produção**
Vou configurar VPS e domínio, implementar SSL/HTTPS, criar backups automatizados e configurar monitoramento e alertas.
**Resultado:** Sistema em produção, estável e monitorado

### 🌟 **Sprint 5: Mobile e Features Avançadas (Futuro)**
Vou desenvolver apps mobile e implementar Dashboard IA, Votações, Financeiro.
**Resultado:** Expansão do produto

---

## ✨ Conclusão

**Minha Estratégia:** Resolver tudo antes de produção

1. **Primeiro:** Vou deixar o produto perfeito (UX, Features, Testes, Segurança)
2. **Último:** Vou fazer deploy em produção com infraestrutura robusta

**Vou deixar o sistema rock solid antes de ir para produção! 💪🚀**
