# 🗺️ Roadmap de Tarefas Pendentes - SindicoAI

**Atualizado em:** 15/12/2024
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

## 🎯 Prioridade CRÍTICA - Para MVP em Produção

### 1. Melhorias de UX/UI (Essencial para Lançamento)
**Status:** Parcial | **Prioridade:** 🔴 ALTA

- [ ] **Framer Motion Integration**
  - Instalar `framer-motion` nos 3 frontends Web
  - Adicionar micro-interações em botões e cards
  - Animações de transição entre páginas
  - Feedback visual em ações (hover, click, drag)

- [ ] **Progressive Web App (PWA)**
  - Service Workers para cache offline
  - Manifest.json para instalação mobile/desktop
  - Ícones e splash screens
  - Push notifications (web)

- [ ] **Dark/Light Mode Toggle**
  - Criar versão Light dos 3 frontends
  - Persistir preferência do usuário
  - Animação suave de transição entre temas

### 2. Deploy em Produção (BLOQUEADOR)
**Status:** 0% | **Prioridade:** 

#### 2.1 Infraestrutura Base
- [ ] **Escolher e Configurar VPS/Cloud**
  - Opções: AWS EC2, DigitalOcean Droplet, Hetzner, Linode
  - Especificações mínimas: 4GB RAM, 2 vCPU, 80GB SSD
  - Sistema operacional: Ubuntu 22.04 LTS

- [ ] **Configurar Domain e DNS**
  - Registrar domínio (ex: sindicoai.com.br)
  - Configurar DNS A records apontando para VPS
  - Configurar subdomínios (api, admin, morador, funcionario)

- [ ] **SSL/HTTPS com Let's Encrypt**
  - Instalar certbot
  - Gerar certificados SSL
  - Configurar nginx para HTTPS
  - Auto-renewal de certificados

#### 2.2 Docker em Produção
- [ ] **Otimizar docker-compose.yml para Produção**
  - Criar docker-compose.prod.yml
  - Configurar restart policies
  - Definir resource limits (CPU/Memory)
  - Configurar health checks

- [ ] **Configurar Nginx Reverso**
  - Proxy para backend API
  - Servir frontends estáticos
  - Configurar rate limiting
  - Gzip compression

#### 2.3 Segredos e Variáveis
- [ ] **Criar .env.production**
  - Database credentials (fortes)
  - JWT secret keys (únicos)
  - API keys da Google (Gemini)
  - Redis password
  - CORS origins permitidos

- [ ] **Vault/Secret Management**
  - Considerar HashiCorp Vault ou AWS Secrets Manager
  - Rotação automática de senhas

#### 2.4 CI/CD Avançado
- [ ] **Melhorar GitHub Actions Workflow**
  - Build automático em push para main
  - Deploy automático para staging
  - Deploy manual para produção (approval)
  - Rollback automático em caso de falha

- [ ] **Pipeline de Deploy**
  - SSH para VPS
  - Pull latest images
  - Run migrations (Alembic)
  - Restart containers com zero-downtime
  - Health check pós-deploy

#### 2.5 Backups e Disaster Recovery
- [ ] **Backup Automatizado do PostgreSQL**
  - Cron job diário (3AM)
  - Retenção: 7 diários, 4 semanais, 3 mensais
  - Upload para S3 ou storage remoto
  - Script de restore testado

- [ ] **Backup de Uploads (PDFs)**
  - Sincronizar pasta `/uploads` para S3
  - Backup incremental diário

---

## 🔧 Prioridade ALTA - Features Importantes

### 3. Funcionalidades Faltantes
**Status:** Parcial | **Prioridade:** 🟡 ALTA

- [ ] **Recuperação de Senha (Forgot Password)**
  - Endpoint: POST `/auth/forgot-password`
  - Enviar email com token de reset
  - Página de reset password no frontend
  - Expiração de token (1 hora)

- [ ] **Agendar Notificações**
  - Campo `scheduled_for` na tabela `notifications`
  - Celery ou APScheduler para envio agendado
  - Interface no Admin para agendar

- [ ] **Audit Log Completo**
  - Tabela `audit_logs` (user_id, action, entity, timestamp, changes)
  - Middleware para capturar CREATE/UPDATE/DELETE
  - Endpoint: GET `/admin/audit-logs` com filtros
  - Página de visualização no Admin

- [ ] **WebSocket para Notificações em Tempo Real**
  - Instalar `python-socketio` ou `fastapi-websockets`
  - Endpoint `/ws/notifications`
  - Integrar com frontend (Socket.IO client)
  - Notificação instantânea sem refresh

### 4. Testes de Qualidade
**Status:** 20% | **Prioridade:** 🟡 ALTA

- [ ] **Aumentar Cobertura de Testes Backend**
  - Unit tests para todos os services (>80%)
  - Integration tests para rotas críticas
  - Rodar `pytest --cov` e gerar relatório
  - Meta: Coverage >70%

- [ ] **Testes E2E Frontend**
  - Instalar Cypress ou Playwright
  - Testes críticos:
    - Login flow (admin, morador, funcionário)
    - Criar reserva (morador)
    - Cancelar reserva (morador)
    - Aprovar/rejeitar reserva (admin)
    - Chat IA com resposta
    - Upload de documentos
    - Gestão de usuários (CRUD)

- [ ] **Testes de Carga (Load Testing)**
  - Instalar Locust ou k6
  - Scripts para:
    - 100 usuários simultâneos fazendo login
    - 50 reservas criadas ao mesmo tempo
    - 20 perguntas à IA concorrentes
  - Medir latência (P95, P99)
  - Identificar bottlenecks

---

## 🚀 Prioridade MÉDIA - Melhorias e Otimizações

### 5. Segurança e Compliance
**Status:** 60% | **Prioridade:** 🟠 MÉDIA

- [ ] **Pentest Básico**
  - Rodar OWASP ZAP automated scan
  - Verificar SQL Injection, XSS, CSRF
  - Testar rate limiting
  - Validar autenticação e autorização

- [ ] **Auditoria de Multi-tenancy**
  - Verificar isolamento entre condomínios
  - Testar vazamento de dados entre tenants
  - Revisar todas as queries (WHERE tenant_id=?)

- [ ] **LGPD/GDPR Compliance**
  - Política de privacidade
  - Termo de uso
  - Botão de "Exportar meus dados"
  - Botão de "Deletar minha conta"

### 6. Observabilidade e Monitoramento
**Status:** 0% | **Prioridade:** 🟠 MÉDIA

- [ ] **Prometheus + Grafana**
  - Instalar Prometheus para coletar métricas
  - Configurar Grafana dashboards
  - Métricas a monitorar:
    - CPU/Memory/Disk por container
    - Request rate (req/s)
    - Error rate (%)
    - P95/P99 latency
    - Tokens consumidos IA (custo)
    - Database connections

- [ ] **Logging Centralizado**
  - ELK Stack (Elasticsearch, Logstash, Kibana)
  - Ou alternativa: Loki + Promtail
  - Logs estruturados (JSON format)
  - Níveis: DEBUG, INFO, WARNING, ERROR, CRITICAL

- [ ] **Alertas Automáticos**
  - Alertmanager integrado ao Prometheus
  - Alertas críticos:
    - CPU >80% por 5min
    - Memória >90%
    - Disco >85%
    - Error rate >5%
    - API down (health check failed)
  - Canais: Email, Slack, Telegram

- [ ] **Health Checks Avançados**
  - Endpoint: GET `/health` (basic)
  - Endpoint: GET `/health/detailed` (check DB, Redis, IA)
  - Uptime monitoring (UptimeRobot, Pingdom)

---

## 🌟 Prioridade BAIXA - Features Futuras

### 7. Mobile Apps (React Native)
**Status:** 0% | **Prioridade:** 🟢 BAIXA (Futuro)

#### 7.1 App Morador Mobile
- [ ] **Setup React Native + Expo**
  - Criar projeto: `npx create-expo-app@latest morador-mobile`
  - Configurar TypeScript
  - Instalar dependências: React Navigation, React Query, Axios

- [ ] **Funcionalidades Core**
  - Autenticação (login biométrico)
  - Listagem de áreas comuns
  - Criar/cancelar reserva
  - Ver notificações (push)
  - Chat IA
  - Perfil e alterar senha

- [ ] **Features Mobile-Specific**
  - Notificações Push (Expo Notifications)
  - Biometria (Face ID / Touch ID)
  - QR Code scanner (check-in em áreas)
  - Modo offline básico (cache local)

#### 7.2 App Funcionário Mobile
- [ ] **Setup React Native + Expo**
  - Projeto separado ou app único com roles?

- [ ] **Funcionalidades Core**
  - Login
  - Dashboard com agenda do dia
  - Iniciar/concluir reservas
  - Reportar problemas
  - QR Code scanner (validar reservas)

- [ ] **Offline-First**
  - WatermelonDB ou SQLite local
  - Sincronização automática quando online
  - Queue de ações pendentes

### 8. Features Avançadas (Nice to Have)
**Status:** 0% | **Prioridade:** 🟢 BAIXA

- [ ] **Dashboard de Métricas de IA**
  - Página no Admin: `/admin/ai-metrics`
  - Gráficos de:
    - Perguntas mais frequentes
    - Tokens consumidos por mês
    - Custo estimado da IA
    - Taxa de satisfação (like/dislike)
    - Documentos mais consultados

- [ ] **Sistema de Votação/Assembleias**
  - Criar enquetes e votações
  - Moradores votam via app
  - Resultado em tempo real
  - Ata digital automática

- [ ] **Gestão Financeira**
  - CRUD de despesas/receitas do condomínio
  - Relatórios financeiros
  - Integração com bancos (OFX import)
  - Boletos e cobranças

- [ ] **Marketplace de Fornecedores**
  - Lista de prestadores de serviço
  - Avaliações de moradores
  - Agendamento online

- [ ] **Chat entre Moradores**
  - Sistema de mensagens diretas
  - Grupos por bloco/torre
  - Moderação pelo síndico

---

## 📈 Métricas de Progresso

| Fase | Concluído | Pendente | % |
|------|-----------|----------|---|
| **Fase 1: Fundação** | 13 | 0 | 100% ✅ |
| **Fase 2: Backend Core** | 6 | 0 | 100% ✅ |
| **Fase 3: IA e RAG** | 18 | 0 | 100% ✅ |
| **Fase 4: Frontend Web** | 10 | 3 | 77% 🟡 |
| **Fase 4: Frontend Mobile** | 0 | 10 | 0% ❌ |
| **Fase 5: Qualidade** | 2 | 7 | 22% 🟡 |
| **Fase 6: Lançamento** | 0 | 10 | 0% ❌ |
| **Total** | 49 | 30 | 62% |

---

## 🎯 Recomendação de Execução

### Sprint 1: Deploy MVP (2 semanas)
1. ✅ Framer Motion integration
2. ✅ PWA setup básico
3. 🔴 Deploy em VPS (SSL + Domain + Docker Prod)
4. 🔴 Backups automatizados
5. ✅ Testes E2E críticos

### Sprint 2: Features Essenciais (1 semana)
6. ✅ Recuperação de senha
7. ✅ Agendar notificações
8. ✅ Audit Log

### Sprint 3: Monitoramento (1 semana)
9. ✅ Prometheus + Grafana básico
10. ✅ Logging centralizado
11. ✅ Alertas críticos

### Sprint 4: Qualidade (1-2 semanas)
12. ✅ Cobertura de testes >70%
13. ✅ Testes de carga
14. ✅ Pentest OWASP ZAP

### Futuro: Mobile e Features Avançadas
- Mobile apps (3-4 meses)
- Dashboard IA, Votações, Financeiro (3-6 meses)

---

## ✨ Conclusão

**O SindicoAI está funcional e robusto para demonstração.**

**Para lançar em produção, é necessário:**
1. Deploy em servidor real (VPS + SSL + Domain)
2. Backups e monitoramento
3. Testes de qualidade (E2E + Load)
4. PWA e melhorias de UX

**Tempo estimado para produção:** 3-4 semanas trabalhando full-time.

**Sistema está pronto para ser usado e gerar valor! 🚀**
