# SindicoAI — Plano de Refatoração Arquitetural

## Visão Geral

Plano de refatoração para resolver acoplamentos, inversões de dependência e inconsistências mapeadas na auditoria arquitetural.

### Decisões Arquiteturais

| # | Decisão | Diretriz |
|---|---------|----------|
| 1 | Backend: Camadas | Manter estrutura por camadas (`models/`, `services/`, `repositories/`), reforçar fronteiras |
| 2 | Frontend Monorepo | **Turborepo** + pnpm workspaces (recomendação do agente) |
| 3 | Estado Frontend | Manual (mantém), com hooks reutilizáveis e métricas server-side |
| 4 | Padrão de Serviços | **Funções de módulo** — padronizar classes existentes para funções |
| 5 | Terraform | Ignorar completamente — não será usado |

---

## FASE 1 — Backlog Crítico (Acoplamentos Reais)

### #1 — Split `models/base.py` em arquivos por domínio

**Problema:** God file com 230+ linhas contendo TODOS os modelos ORM, misturando bounded contexts.

**Solução:** Criar `app/models/` com arquivos separados:

| Arquivo | Modelos |
|---------|---------|
| `models/__init__.py` | Re-exporta tudo para compatibilidade |
| `models/core.py` | `Tenant`, `User`, `UserRole` |
| `models/unit.py` | `Unit` |
| `models/common_area.py` | `CommonArea` |
| `models/reservation.py` | `Reservation` |
| `models/notification.py` | `Notification` |
| `models/event.py` | `Event`, `EventRSVP` |
| `models/base.py` | Mantém apenas `generate_uuid`, `Base` import, enums compartilhados |

**Impacto:** ~30+ imports atualizados em services, repositories, routes.

### #2 — Eliminar `generate_uuid` duplicado

**Problema:** Função duplicada em 3 arquivos (`base.py`, `document.py`, `audit.py`).

**Solução:**
- Criar `app/core/uuid.py` com `generate_uuid()`
- Importar de lá em todos os modelos
- Remover duplicatas

### #3 — Mover helpers de cookie para `core/cookies.py`

**Problema:** `onboarding.py` importa `_set_refresh_cookie` de `auth.py` — cross-route import.

**Solução:**
- Criar `app/core/cookies.py` com `_set_refresh_cookie`, `_clear_refresh_cookie`, `REFRESH_COOKIE_NAME`
- `auth.py` e `onboarding.py` importam de `core/cookies.py`

### #5 — Adicionar `create()` factories nos repositórios

**Problema:** Services instanciam modelos ORM diretamente, bypassando repositórios.

**Ocorrências:**
- `reservation_service.py`: `Reservation(...)`
- `event_service.py`: `Event(...)`
- `unit_service.py`: `Unit(...)`
- `common_area_service.py`: `CommonArea(...)`
- `notification_service.py`: `Notification(...)`
- `registration_service.py`: `User(...)`, `Tenant(...)`
- `document_service.py`: `DocumentChunk(...)`
- `documents.py` route: `Document(...)`

**Solução:**
- Adicionar `async def create(self, **data) -> T` em `BaseRepository`
- Sobrescrever em repositórios específicos quando necessário (ex: `UnitRepository.create_with_defaults`)
- Refatorar todos os services para usar `repo.create(data)` ao invés de `Model(...)`

### #4 — Remover secrets hardcoded do docker-compose.yml

**Problema:** `POSTGRES_PASSWORD: sua_senha_segura`, `SECRET_KEY: sua_chave_aleatoria_segura`, `POSTGRES_USER: fabiof` hardcoded.

**Solução:**
- Remover valores hardcoded do docker-compose.yml
- Usar variáveis de ambiente com `${VAR}` syntax
- Adicionar `.env.example` completo na raiz
- Adicionar `POSTGRES_USER` genérico

---

## FASE 2 — Backlog Alto (Consistência e Testabilidade)

### #8 — Consolidar `genai.configure()` no `main.py` lifespan

**Problema:** `document_service.py` e `rag_service.py` chamam `genai.configure()` independentemente.

**Solução:**
- Chamar `genai.configure()` uma vez no `lifespan` do `main.py`
- Remover chamadas dos services

### #13 — Fix scheduler com tenant awareness

**Problema:** Scheduler consulta TODAS as notificações sem filtrar por tenant.

**Solução:**
- Adicionar filtro por tenant no scheduler
- Ou usar repositório com tenant scoping

### #9 — Padronizar `DocumentProcessor` e `RAGService` como funções

**Problema:** São classes num código-base onde services são funções.

**Solução:**
- Extrair métodos em funções de módulo
- `text_splitter` vai para função helper
- `DocumentProcessor.process_document()` → `process_document(document_id, file_path)`
- `RAGService.chat()` → `ai_chat(db, question, tenant_id)`
- Remover classes

### #10 — Substituir `CacheService` estático por funções injetáveis

**Problema:** Static methods com singleton global escondido.

**Solução:**
- Converter para funções de módulo: `get_cached_response()`, `cache_response()`, etc.
- Redis client via parâmetro ou função helper

### #11 — Desacoplar `NotificationService` do WebSocket manager

**Problema:** Import direto do singleton `manager`.

**Solução:**
- Criar protocolo `NotificationBroadcaster`
- Implementação WebSocket como default
- Injetar via parâmetro ou função getter

### #14 — Remover re-exports do admin frontend

**Problema:** Arquivos de 1 linha que só re-exportam `@shared/...`.

**Solução:**
- Deletar `admin/src/services/api.ts`, `admin/src/services/authService.ts`, etc.
- Importar `@shared/...` diretamente

### #15 — Barrel `index.ts` no shared frontend

**Problema:** Só `components/` tem index. Hooks, services, types, utils não.

**Solução:** Adicionar `index.ts` em cada subdiretório do shared.

### #16 — Healthchecks no docker-compose

**Problema:** Só Redis tem healthcheck.

**Solução:** Adicionar healthchecks para PostgreSQL, backend, e frontends.

### #17 — Frontend no CI

**Problema:** CI só cobre backend (e testes comentados).

**Solução:** Adicionar lint, type-check, e build dos frontends no `.github/workflows/ci.yml`.

---

## FASE 3 — Backlog Médio (Qualidade e DX)

### #18 — Frontend → Turborepo

Setup Turborepo com pnpm workspaces. `@sindico/shared` como package real.

### #19 — Password validation → Pydantic validator

Mover `validate_password_strength` de `auth_service.py` para `schemas/` como `@field_validator`.

### #20 — Report service usa repositórios

Substituir queries raw SQLAlchemy por `ReservationRepository`.

### #22 — Padronizar serviços como funções

Converter `DocumentProcessor`, `RAGService`, `CacheService` (já feito na Fase 2), `FileValidator`.

### #23 — TypeScript interfaces para APIs

Criar interfaces tipadas para todas as respostas da API (eliminar `any`).

### #25 — Unificar design tokens

DashboardPage usa tema "lobby", outras páginas usam tema "cyber". Unificar.

### #26 — `.dockerignore` por app frontend

Criar `.dockerignore` em `admin/`, `morador/`, `funcionario/`, `landing/`.

---

## FASE 4 — Backlog Baixo (Higiene)

- #30: Povoar `__init__.py` com exports públicos
- #31: Padronizar naming de services
- #32: Type hints em repository model attribute
- #33: Convenção de `db.commit()`
- #34: Remover código morto frontend (FadeIn, PageTransition, SkeletonList, Zustand)
- #35: Pin Python dependencies (pip-tools/poetry)
- #36: Alinhar ESLint versions
- #37: Atualizar GitHub Actions (v4/v5)

---

## Regras de Execução

1. **Sempre rodar testes** após cada mudança
2. **Uma tarefa por vez** — completar antes de iniciar próxima
3. **Compatibilidade retroativa** — `models/__init__.py` re-exporta para não quebrar imports existentes
4. **Commits atômicos** — um commit por tarefa
5. **Verificar imports** — garantir que todos os imports apontam para os novos locais
