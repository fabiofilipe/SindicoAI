# Scripts de Gerenciamento do Banco de Dados

Este diretório contém scripts úteis para desenvolvimento e testes.

##  Scripts Disponíveis

### 1. `seed_database.py` - Popular Banco com Dados de Teste

Popula o banco de dados com dados realistas para desenvolvimento e demonstrações.

**O que cria:**
- 1 Tenant (Condomínio "Edifício Residencial Prime")
- 3 Usuários:
  - Admin (`admin@prime.com` / `admin123`)
  - Morador (`morador@prime.com` / `morador123`)
  - Funcionário (`funcionario@prime.com` / `func123`)
- 4 Áreas Comuns (Salão de Festas, Churrasqueiras, Quadra)
- 5 Reservas (com diferentes status e datas)
- 10 Notificações (algumas lidas, outras não)

**Como usar:**
```bash
cd backend
python scripts/seed_database.py
```

### 2. `reset_database.py` - Limpar Banco de Dados

Apaga TODOS os dados e tabelas do banco. Útil para começar do zero.

**ATENÇÃO:** Este script é destrutivo! Confirme antes de executar.

**Como usar:**
```bash
cd backend
python scripts/reset_database.py
```

##  Workflow Recomendado

Para resetar e popular o banco do zero:

```bash
cd backend

# 1. Limpar banco (vai pedir confirmação)
python scripts/reset_database.py

# 2. Popular com dados de teste
python scripts/seed_database.py
```

##  Credenciais de Teste

Após executar o seed, você pode fazer login com:

| Tipo | Email | Senha | Unidade |
|------|-------|-------|---------|
| Admin | admin@prime.com | admin123 | ADM-001 |
| Morador | morador@prime.com | morador123 | 301 |
| Funcionário | funcionario@prime.com | func123 | STAFF-001 |

##  Notas

- Os scripts usam as configurações do arquivo `.env`
- Certifique-se de que o PostgreSQL está rodando
- Certifique-se de ter as dependências instaladas: `pip install -r requirements.txt`
- Os dados são criados para o tenant "Edifício Residencial Prime" (domain: prime)
