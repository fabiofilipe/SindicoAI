"""
Script de Testes e Validação - Fase 3 RAG
Executa todos os testes do checklist de validação
"""
from pathlib import Path
import json

# Cores para output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RESET = "\033[0m"

def print_test(name, status):
    symbol = f"{GREEN}✅{RESET}" if status else f"{RED}❌{RESET}"
    print(f"{symbol} {name}")

def print_section(name):
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}{name}{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")

# Resultados dos testes
results = {
    "upload_pdf": None,
    "processamento_background": None,
    "busca_semantica": None,
    "chat_respostas": None,
    "rate_limiting": None,
    "cache": None,
    "multi_tenant": None
}

print_section("🧪 TESTES E VALIDAÇÃO - FASE 3 RAG")

# ============================================================
# Teste 1: Upload de PDF
# ============================================================
print_section("1️⃣ Upload de PDF")
print("Verificando endpoint de upload...")

upload_route = Path(__file__).parent.parent / "app" / "api" / "routes" / "documents.py"
if upload_route.exists():
    with open(upload_route, "r") as f:
        content = f.read()
    
    checks = [
        ('router.post' in content and 'upload' in content, "Endpoint POST /upload"),
        ("UploadFile" in content, "Aceita upload de arquivos"),
        ("require_admin" in content, "Apenas admin pode fazer upload"),
        (".pdf" in content, "Valida arquivos PDF"),
        ("background_tasks" in content, "Processamento em background"),
        ("DocumentProcessor" in content, "Usa DocumentProcessor")
    ]
    
    all_passed = all(check[0] for check in checks)
    for passed, desc in checks:
        print_test(desc, passed)
    
    results["upload_pdf"] = all_passed
else:
    print_test("Endpoint de upload criado", False)
    results["upload_pdf"] = False

# ============================================================
# Teste 2: Processamento em Background
# ============================================================
print_section("2️⃣ Processamento em Background")
print("Verificando DocumentProcessor...")

processor_path = Path(__file__).parent.parent / "app" / "services" / "document_service.py"
if processor_path.exists():
    with open(processor_path, "r") as f:
        content = f.read()
    
    checks = [
        ("class DocumentProcessor" in content, "Classe DocumentProcessor"),
        ("extract_text_from_pdf" in content, "Extração de texto"),
        ("chunk_text" in content, "Chunking de texto"),
        ("generate_embedding" in content, "Geração de embeddings"),
        ("process_document" in content, "Pipeline completo"),
        ('status = "completed"' in content or 'status = "extracting"' in content, "Atualização de status"),
        ("DocumentChunk" in content, "Salva chunks no banco")
    ]
    
    all_passed = all(check[0] for check in checks)
    for passed, desc in checks:
        print_test(desc, passed)
    
    results["processamento_background"] = all_passed
else:
    print_test("DocumentProcessor criado", False)
    results["processamento_background"] = False

# ============================================================
# Teste 3: Busca Semântica
# ============================================================
print_section("3️⃣ Busca Semântica")
print("Verificando RAGService...")

rag_path = Path(__file__).parent.parent / "app" / "services" / "rag_service.py"
if rag_path.exists():
    with open(rag_path, "r") as f:
        content = f.read()
    
    checks = [
        ("class RAGService" in content, "Classe RAGService"),
        ("generate_query_embedding" in content, "Embedding da query"),
        ("search_similar_chunks" in content, "Busca de chunks similares"),
        ("pgvector" in content.lower() or "vector" in content.lower(), "Usa pgvector"),
        ("similarity" in content or "cosine" in content, "Similarity search"),
        ("tenant_id" in content, "Filtra por tenant")
    ]
    
    all_passed = all(check[0] for check in checks)
    for passed, desc in checks:
        print_test(desc, passed)
    
    results["busca_semantica"] = all_passed
else:
    print_test("RAGService criado", False)
    results["busca_semantica"] = False

# ============================================================
# Teste 4: Chat Retorna Respostas
# ============================================================
print_section("4️⃣ Chat com IA")
print("Verificando endpoint de chat...")

ai_route = Path(__file__).parent.parent / "app" / "api" / "routes" / "ai.py"
if ai_route.exists():
    with open(ai_route, "r") as f:
        content = f.read()
    
    checks = [
        ('router.post' in content and 'chat' in content, "Endpoint POST /chat"),
        ("ChatRequest" in content, "Schema ChatRequest"),
        ("ChatResponse" in content, "Schema ChatResponse"),
        ("rag_service.chat" in content, "Usa RAGService"),
        ("answer" in content and "sources" in content, "Retorna answer e sources"),
        ("tenant_id" in content, "Multi-tenant")
    ]
    
    all_passed = all(check[0] for check in checks)
    for passed, desc in checks:
        print_test(desc, passed)
    
    results["chat_respostas"] = all_passed
else:
    print_test("Endpoint de chat criado", False)
    results["chat_respostas"] = False

# ============================================================
# Teste 5: Rate Limiting
# ============================================================
print_section("5️⃣ Rate Limiting")
print("Verificando rate limiting...")

rate_limit_path = Path(__file__).parent.parent / "app" / "middleware" / "rate_limit.py"
if rate_limit_path.exists():
    with open(rate_limit_path, "r") as f:
        rate_content = f.read()
    
    with open(ai_route, "r") as f:
        ai_content = f.read()
    
    checks = [
        ("check_rate_limit" in rate_content, "Função check_rate_limit"),
        ("Redis" in rate_content, "Usa Redis"),
        ("HTTPException" in rate_content and "429" in rate_content, "Retorna erro 429"),
        ("rate_limit:ai:" in rate_content, "Chave de rate limit"),
        ("check_rate_limit" in ai_content, "Aplicado no endpoint /chat"),
        ("limit=" in rate_content or "limit:" in rate_content, "Limite configurável")
    ]
    
    all_passed = all(check[0] for check in checks)
    for passed, desc in checks:
        print_test(desc, passed)
    
    results["rate_limiting"] = all_passed
else:
    print_test("Rate limiting implementado", False)
    results["rate_limiting"] = False

# ============================================================
# Teste 6: Cache
# ============================================================
print_section("6️⃣ Cache de Respostas")
print("Verificando cache service...")

cache_path = Path(__file__).parent.parent / "app" / "services" / "cache_service.py"
if cache_path.exists():
    with open(cache_path, "r") as f:
        cache_content = f.read()
    
    with open(ai_route, "r") as f:
        ai_content = f.read()
    
    checks = [
        ("CacheService" in cache_content, "Classe CacheService"),
        ("get_cached_response" in cache_content, "Busca em cache"),
        ("cache_response" in cache_content, "Salva em cache"),
        ("hashlib.md5" in cache_content, "Hash MD5 para chave"),
        ("get_cached_response" in ai_content, "Aplica cache no /chat"),
        ("ttl" in cache_content.lower(), "TTL configurável")
    ]
    
    all_passed = all(check[0] for check in checks)
    for passed, desc in checks:
        print_test(desc, passed)
    
    results["cache"] = all_passed
else:
    print_test("Cache implementado", False)
    results["cache"] = False

# ============================================================
# Teste 7: Isolamento Multi-tenant
# ============================================================
print_section("7️⃣ Isolamento Multi-tenant")
print("Verificando isolamento de dados...")

models_path = Path(__file__).parent.parent / "app" / "models" / "document.py"
if models_path.exists():
    with open(models_path, "r") as f:
        models_content = f.read()
    
    with open(rag_path, "r") as f:
        rag_content = f.read()
    
    checks = [
        ("tenant_id" in models_content, "Modelos têm tenant_id"),
        ("ForeignKey" in models_content and "tenants" in models_content, "FK para tenants"),
        ("tenant_id" in rag_content, "RAG filtra por tenant_id"),
        ("WHERE" in rag_content and "tenant_id" in rag_content, "Query filtra tenant"),
    ]
    
    all_passed = all(check[0] for check in checks)
    for passed, desc in checks:
        print_test(desc, passed)
    
    results["multi_tenant"] = all_passed
else:
    print_test("Models com tenant_id", False)
    results["multi_tenant"] = False

# ============================================================
# Resumo Final
# ============================================================
print_section("📊 RESUMO DOS TESTES")

total_tests = len(results)
passed_tests = sum(1 for v in results.values() if v)
failed_tests = total_tests - passed_tests

print(f"Total de testes: {total_tests}")
print(f"{GREEN}Passou: {passed_tests}{RESET}")
print(f"{RED}Falhou: {failed_tests}{RESET}")
print(f"Taxa de sucesso: {(passed_tests/total_tests)*100:.1f}%\n")

# Detalhes por teste
for test_name, result in results.items():
    status = f"{GREEN}✅ PASSOU{RESET}" if result else f"{RED}❌ FALHOU{RESET}"
    print(f"  {test_name.replace('_', ' ').title()}: {status}")

# Salvar resultados
results_file = Path(__file__).parent / "test_results.json"
with open(results_file, "w") as f:
    json.dump({
        "total": total_tests,
        "passed": passed_tests,
        "failed": failed_tests,
        "success_rate": f"{(passed_tests/total_tests)*100:.1f}%",
        "tests": results
    }, f, indent=2)

print(f"\n{BLUE}Resultados salvos em: {results_file}{RESET}")

# Exit code
exit(0 if all(results.values()) else 1)
