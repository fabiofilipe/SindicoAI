import os
import google.generativeai as genai

# Configurar API
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

print("=" * 60)
print("🧪 TESTANDO GOOGLE GEMINI API")
print("=" * 60)

# Teste 1: Listar modelos disponíveis
print("\n1️⃣ Modelos disponíveis:")
try:
    count = 0
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            print(f"   ✅ {model.name}")
            count += 1
            if count >= 3:  # Mostrar apenas 3 primeiros
                break
    print(f"   ✅ {count} modelos encontrados!")
except Exception as e:
    print(f"   ❌ Erro: {e}")

# Teste 2: Gerar embedding
print("\n2️⃣ Testando geração de embedding:")
try:
    result = genai.embed_content(
        model="models/text-embedding-004",
        content="Qual o horário de funcionamento da piscina?",
        task_type="retrieval_query"
    )
    embedding = result['embedding']
    print(f"   ✅ Embedding gerado com sucesso!")
    print(f"   📊 Dimensões: {len(embedding)}")
    print(f"   📊 Primeiros 5 valores: {embedding[:5]}")
except Exception as e:
    print(f"   ❌ Erro: {e}")

# Teste 3: Gerar resposta com Gemini 2.5 Flash
print("\n3️⃣ Testando geração de resposta:")
try:
    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content("Responda em uma frase: O que é um condomínio?")
    print(f"   ✅ Resposta gerada com sucesso!")
    print(f"   💬 Resposta: {response.text}")
except Exception as e:
    print(f"   ❌ Erro: {e}")

print("\n" + "=" * 60)
print("✅ TODOS OS TESTES CONCLUÍDOS!")
print("=" * 60)
