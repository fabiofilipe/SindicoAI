import asyncio
import json
import os
import sys
from pathlib import Path

# Adicionar o diretório raiz ao PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.services.rag_service import RAGService
from app.core.config import settings

async def evaluate_rag():
    """Avalia a qualidade do sistema RAG"""
    
    # Carregar dataset
    dataset_path = Path(__file__).parent / "test_dataset.json"
    with open(dataset_path, "r", encoding="utf-8") as f:
        test_cases = json.load(f)
    
    # Setup database
    engine = create_async_engine(settings.DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    rag_service = RAGService()
    results = []
    
    print("=" * 80)
    print("🧪 AVALIAÇÃO DO SISTEMA RAG")
    print("=" * 80)
    print(f"\nTotal de casos de teste: {len(test_cases)}")
    print(f"Tenant ID: {os.getenv('TEST_TENANT_ID', 'TENANT_ID_PADRAO')}")
    print("\n" + "=" * 80)
    
    async with async_session() as db:
        for idx, test_case in enumerate(test_cases, 1):
            print(f"\n{'='*80}")
            print(f"📝 CASO DE TESTE {idx}/{len(test_cases)}")
            print(f"{'='*80}")
            print(f"❓ Pergunta: {test_case['question']}")
            print(f"✅ Resposta esperada: {test_case['expected_answer']}")
            
            try:
                # Executar RAG
                result = await rag_service.chat(
                    db=db,
                    question=test_case['question'],
                    tenant_id=os.getenv('TEST_TENANT_ID', 'TENANT_ID_PADRAO'),
                    max_chunks=5
                )
                
                print(f"\n💬 Resposta obtida:")
                print(f"   {result['answer']}")
                print(f"\n📚 Fontes: {len(result['sources'])} documentos")
                
                for source_idx, source in enumerate(result['sources'], 1):
                    print(f"   {source_idx}. {source['document']} - Página {source['page']} (Similaridade: {source['similarity']:.2%})")
                
                # Avaliar palavras-chave
                keywords_found = sum(
                    1 for keyword in test_case['context_should_contain']
                    if keyword.lower() in result['answer'].lower()
                )
                keywords_total = len(test_case['context_should_contain'])
                keyword_match_rate = keywords_found / keywords_total if keywords_total > 0 else 0
                
                print(f"\n📊 Métricas:")
                print(f"   - Palavras-chave encontradas: {keywords_found}/{keywords_total} ({keyword_match_rate:.1%})")
                print(f"   - Palavras-chave esperadas: {', '.join(test_case['context_should_contain'])}")
                
                # Avaliar
                evaluation = {
                    "question": test_case['question'],
                    "answer": result['answer'],
                    "expected_answer": test_case['expected_answer'],
                    "sources_count": len(result['sources']),
                    "expected_keywords": test_case['context_should_contain'],
                    "keywords_found": keywords_found,
                    "keyword_match_rate": keyword_match_rate,
                    "success": True
                }
                
                results.append(evaluation)
            
            except Exception as e:
                print(f"\n❌ Erro ao processar pergunta: {str(e)}")
                evaluation = {
                    "question": test_case['question'],
                    "answer": None,
                    "expected_answer": test_case['expected_answer'],
                    "sources_count": 0,
                    "expected_keywords": test_case['context_should_contain'],
                    "keywords_found": 0,
                    "keyword_match_rate": 0.0,
                    "success": False,
                    "error": str(e)
                }
                results.append(evaluation)
    
    # Calcular métricas finais
    print(f"\n{'='*80}")
    print("📊 RESULTADOS FINAIS DA AVALIAÇÃO")
    print(f"{'='*80}")
    
    successful_tests = [r for r in results if r['success']]
    failed_tests = [r for r in results if not r['success']]
    
    total_tests = len(results)
    success_rate = len(successful_tests) / total_tests if total_tests > 0 else 0
    
    print(f"\n✅ Testes bem-sucedidos: {len(successful_tests)}/{total_tests} ({success_rate:.1%})")
    print(f"❌ Testes falhados: {len(failed_tests)}/{total_tests}")
    
    if successful_tests:
        avg_sources = sum(r['sources_count'] for r in successful_tests) / len(successful_tests)
        avg_keyword_match = sum(r['keyword_match_rate'] for r in successful_tests) / len(successful_tests)
        
        print(f"\n📈 Métricas dos testes bem-sucedidos:")
        print(f"   - Média de fontes recuperadas: {avg_sources:.2f}")
        print(f"   - Taxa média de palavras-chave encontradas: {avg_keyword_match:.1%}")
        
        # Classificação da qualidade
        if avg_keyword_match >= 0.85:
            quality = "🌟 EXCELENTE"
        elif avg_keyword_match >= 0.70:
            quality = "✅ BOM"
        elif avg_keyword_match >= 0.50:
            quality = "⚠️  RAZOÁVEL"
        else:
            quality = "❌ PRECISA MELHORIAS"
        
        print(f"\n🎯 Qualidade geral do sistema RAG: {quality}")
    
    if failed_tests:
        print(f"\n⚠️  Erros encontrados:")
        for test in failed_tests:
            print(f"   - {test['question']}: {test.get('error', 'Erro desconhecido')}")
    
    # Salvar resultados em arquivo JSON
    results_path = Path(__file__).parent / "evaluation_results.json"
    with open(results_path, "w", encoding="utf-8") as f:
        json.dump({
            "total_tests": total_tests,
            "successful_tests": len(successful_tests),
            "failed_tests": len(failed_tests),
            "success_rate": success_rate,
            "avg_sources": avg_sources if successful_tests else 0,
            "avg_keyword_match": avg_keyword_match if successful_tests else 0,
            "detailed_results": results
        }, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Resultados salvos em: {results_path}")
    print(f"\n{'='*80}")
    
    return results

if __name__ == "__main__":
    print("\n🚀 Iniciando avaliação do sistema RAG...")
    print("⚠️  Certifique-se de que:")
    print("   1. O banco de dados está rodando")
    print("   2. Existem documentos processados no banco")
    print("   3. A variável TEST_TENANT_ID está configurada no .env")
    print()
    
    asyncio.run(evaluate_rag())
