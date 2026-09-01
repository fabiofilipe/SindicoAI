import os

from agno.agent import Agent
from agno.knowledge.embedder.google import GeminiEmbedder
from agno.models.google import Gemini

api_key = os.getenv("GOOGLE_API_KEY")

print("=" * 60)
print(" TESTANDO GOOGLE GEMINI API")
print("=" * 60)

# Teste 1: Gerar embedding
print("\n1. Testando geração de embedding:")
try:
    embedder = GeminiEmbedder(
        id="gemini-embedding-001",
        task_type="RETRIEVAL_QUERY",
        dimensions=3072,
        api_key=api_key,
    )
    embedding = embedder.get_embedding("Qual o horário de funcionamento da piscina?")
    print("    Embedding gerado com sucesso!")
    print(f"    Dimensões: {len(embedding)}")
    print(f"    Primeiros 5 valores: {embedding[:5]}")
except Exception as e:  # noqa: BLE001 - diagnostic script reports provider errors
    print(f"   ❌ Erro: {e}")

# Teste 2: Gerar resposta com Gemini 2.5 Flash
print("\n2. Testando geração de resposta:")
try:
    agent = Agent(model=Gemini(id="gemini-2.5-flash", api_key=api_key))
    response = agent.run("Responda em uma frase: O que é um condomínio?")
    print("    Resposta gerada com sucesso!")
    print(f"    Resposta: {response.content}")
except Exception as e:  # noqa: BLE001 - diagnostic script reports provider errors
    print(f"   ❌ Erro: {e}")

print("\n" + "=" * 60)
print("✅ TODOS OS TESTES CONCLUÍDOS!")
print("=" * 60)
