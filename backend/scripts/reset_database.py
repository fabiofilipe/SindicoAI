#!/usr/bin/env python3
"""
Script para limpar (resetar) o banco de dados.
ATENÇÃO: Este script apaga TODOS os dados!
"""

import asyncio
import sys
from pathlib import Path

# Adicionar o diretório raiz ao path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import create_async_engine

from app.core.config import settings
from app.models.base import Base


async def reset_database():
    """Apaga todas as tabelas e recria"""
    
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    
    print("  ATENÇÃO: Este script vai APAGAR TODOS OS DADOS do banco!")
    print(f" Banco: {settings.DATABASE_URL}")
    
    response = input("\nTem certeza que deseja continuar? (yes/no): ")
    
    if response.lower() != "yes":
        print("❌ Operação cancelada.")
        return
    
    print("\n  Apagando todas as tabelas...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    
    print("✅ Banco limpo com sucesso!")
    print("\n Execute 'python scripts/seed_database.py' para popular novamente.")
    
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(reset_database())
