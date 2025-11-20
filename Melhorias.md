# Melhorias - SindicoAI

Este documento lista melhorias e funcionalidades que devem ser implementadas antes da Fase 3 (IA/RAG).

##  CRÍTICO - Implementar IMEDIATAMENTE

### 1. Migrações de Banco de Dados
- [x] Criar migration inicial do Alembic com todos os modelos
- [ ] Testar `alembic upgrade head`
- [ ] Documentar comandos de migration no README

**Motivo**: Sem migrations, o banco de dados não terá as tabelas necessárias.

---

##  IMPORTANTE - Implementar ANTES da Fase 3

### 2. CRUD de Units (Unidades)
- [x] GET `/units` - Listar unidades do condomínio
- [x] POST `/units` - Criar unidade manualmente (admin)
- [x] GET `/units/{id}` - Detalhes de uma unidade
- [x] PUT `/units/{id}` - Atualizar unidade (incluindo CPFs autorizados)
- [x] DELETE `/units/{id}` - Deletar unidade

**Motivo**: Admin precisa gerenciar unidades sem depender apenas de importação.

### 3. Gestão de Usuários (Admin)
- [x] GET `/users` - Listar todos usuários do condomínio (admin)
- [x] GET `/users/{id}` - Detalhes de um usuário
- [x] PUT `/users/{id}/activate` - Ativar usuário
- [x] PUT `/users/{id}/deactivate` - Desativar usuário
- [x] PUT `/users/{id}/reset-password` - Resetar senha (admin)
- [x] GET `/users/me` - Dados do usuário atual

**Motivo**: Admin precisa controle sobre usuários cadastrados.

### 4. Melhorias em Notificações
- [ ] PUT `/notifications/{id}/read` - Marcar notificação como lida
- [ ] GET `/notifications?unread=true` - Filtrar não lidas
- [ ] DELETE `/notifications/{id}` - Deletar notificação

**Motivo**: UX básica para gerenciamento de notificações.

---

##  NICE TO HAVE - Pode esperar para depois da Fase 3

### 5. Validação e Testes
- [ ] Configurar pytest com fixtures
- [ ] Testes para autenticação (login, refresh, register)
- [ ] Testes para importação (units, residents)
- [ ] Testes para notificações em massa
- [ ] Testes de integração end-to-end
- [ ] Coverage report

### 6. Melhorias de UX/API
- [ ] Paginação em listagens (limit/offset ou cursor)
- [ ] Filtros avançados (por data, status, etc.)
- [ ] Ordenação customizável
- [ ] Validação de horários de funcionamento das áreas comuns
- [ ] Endpoint de estatísticas (dashboard data)

### 7. Segurança e Auditoria
- [ ] Logs de auditoria (quem fez o quê, quando)
- [ ] Rate limiting
- [ ] CORS configurado corretamente
- [ ] Validação mais rigorosa de CPF (dígitos verificadores)
- [ ] Política de senhas fortes

### 8. Documentação
- [ ] README.md completo com setup instructions
- [ ] Documentação da API (Swagger/OpenAPI)
- [ ] Exemplos de uso (Postman collection ou curl)
- [ ] Diagrama de arquitetura
- [ ] Guia de contribuição

### 9. DevOps
- [ ] Docker multi-stage build otimizado
- [ ] Health checks mais completos
- [ ] Monitoring/observability (Prometheus/Grafana)
- [ ] Backup automático do banco
- [ ] Ambiente de staging

---

## 📋 Ordem de Implementação Sugerida

1. ✅ **Migrations** (CRÍTICO)
2. ✅ **CRUD de Units** (IMPORTANTE)
3. ✅ **Gestão de Usuários** (IMPORTANTE)
4. ✅ **Melhorias em Notificações** (IMPORTANTE)
5. ⏸️ Testes (após Fase 3)
6. ⏸️ Melhorias de UX (após Fase 3)
7. ⏸️ Segurança avançada (após Fase 3)
8. ⏸️ Documentação completa (contínuo)
9. ⏸️ DevOps avançado (após deploy inicial)

---

## 🎯 Meta

Completar itens 1-4 antes de iniciar a **Fase 3: Inteligência Artificial e RAG**.
