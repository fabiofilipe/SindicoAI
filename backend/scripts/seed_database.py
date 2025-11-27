#!/usr/bin/env python3
"""
Script para popular o banco de dados com dados de teste.
Útil para desenvolvimento e demonstrações.

Cria:
- 1 Tenant (Condomínio)
- 3 Usuários (admin, morador, funcionário)
- 4 Áreas Comuns
- 5 Reservas
- 10 Notificações
- 2 Documentos de exemplo para IA
"""

import asyncio
import sys
from pathlib import Path

# Adicionar o diretório raiz ao path
sys.path.insert(0, str(Path(__file__).parent.parent))

from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text


from app.core.config import settings
from app.core.security import get_password_hash
from app.models.base import Base, User, Tenant, CommonArea, Reservation, Notification


async def create_tables(engine):
    """Cria a extensão vector e todas as tabelas no banco"""
    async with engine.begin() as conn:
        # Habilitar a extensão pgvector
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        print("✅ Extensão 'vector' garantida.")
        
        # Criar todas as tabelas
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Tabelas criadas com sucesso!")


async def seed_data():
    """Popula o banco com dados de teste"""
    
    # Criar engine e session
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    # Criar tabelas
    await create_tables(engine)
    
    async with async_session() as session:
        print("\n Iniciando seed do banco de dados...")
        
        # 1. Criar Tenant
        print("\n Criando Tenant (Condomínio)...")
        tenant = Tenant(
            name="Edifício Residencial Prime",
            domain="prime"
        )
        session.add(tenant)
        await session.flush()
        print(f"  ✓ Tenant criado: {tenant.name} (ID: {tenant.id})")
        
        # 2. Criar Usuários
        print("\n Criando Usuários...")
        
        # Admin
        admin = User(
            email="admin@prime.com",
            hashed_password=get_password_hash("admin123"),
            cpf="111.111.111-11",
            full_name="Admin Sistema",
            role="admin",
            is_active=True,
            tenant_id=tenant.id
        )
        session.add(admin)
        print(f"  ✓ Admin: {admin.email} / Senha: admin123")
        
        # Morador
        resident = User(
            email="morador@prime.com",
            hashed_password=get_password_hash("morador123"),
            cpf="222.222.222-22",
            full_name="João Silva Morador",
            role="resident",
            is_active=True,
            tenant_id=tenant.id
        )
        session.add(resident)
        print(f"  ✓ Morador: {resident.email} / Senha: morador123")
        
        # Funcionário
        staff = User(
            email="funcionario@prime.com",
            hashed_password=get_password_hash("func123"),
            cpf="333.333.333-33",
            full_name="Maria Santos Staff",
            role="staff",
            is_active=True,
            tenant_id=tenant.id
        )
        session.add(staff)
        print(f"  ✓ Funcionário: {staff.email} / Senha: func123")
        
        await session.flush()
        
        # 2.5. Criar Unidades (Apartamentos)
        print("\n🏢 Criando Unidades...")
        
        from app.models.base import Unit
        
        units_data = [
            # Torre A
            {"number": "101", "block": "A", "floor": 1, "type": "2-quartos"},
            {"number": "102", "block": "A", "floor": 1, "type": "3-quartos"},
            {"number": "201", "block": "A", "floor": 2, "type": "2-quartos"},
            {"number": "202", "block": "A", "floor": 2, "type": "3-quartos"},
            {"number": "301", "block": "A", "floor": 3, "type": "2-quartos"},
            # Torre B
            {"number": "101", "block": "B", "floor": 1, "type": "2-quartos"},
            {"number": "102", "block": "B", "floor": 1, "type": "3-quartos"},
            {"number": "201", "block": "B", "floor": 2, "type": "cobertura"},
            {"number": "202", "block": "B", "floor": 2, "type": "3-quartos"},
            {"number": "301", "block": "B", "floor": 3, "type": "2-quartos"},
            # Torre C
            {"number": "101", "block": "C", "floor": 1, "type": "studio"},
            {"number": "102", "block": "C", "floor": 1, "type": "2-quartos"},
            {"number": "201", "block": "C", "floor": 2, "type": "2-quartos"},
            {"number": "202", "block": "C", "floor": 2, "type": "3-quartos"},
            {"number": "301", "block": "C", "floor": 3, "type": "penthouse"},
        ]
        
        units = []
        for unit_data in units_data:
            unit = Unit(
                tenant_id=tenant.id,
                **unit_data
            )
            session.add(unit)
            units.append(unit)
            print(f"  ✓ Apto {unit_data['number']} - Torre {unit_data['block']} ({unit_data['type']})")
        
        await session.flush()
        
        # Associar morador à primeira unidade
        resident.unit_id = units[0].id
        print(f"\n  → Morador '{resident.full_name}' associado à Unidade {units[0].number} - Torre {units[0].block}")
        
        # 3. Criar Áreas Comuns
        print("\n Criando Áreas Comuns...")
        
        areas = [
            {
                "name": "Salão de Festas",
                "description": "Salão equipado para eventos e festas",
                "capacity": 50,
                "opening_time": "08:00",
                "closing_time": "23:00"
            },
            {
                "name": "Churrasqueira 1",
                "description": "Área de churrasqueira com mesas",
                "capacity": 20,
                "opening_time": "10:00",
                "closing_time": "22:00"
            },
            {
                "name": "Churrasqueira 2",
                "description": "Segunda área de churrasqueira",
                "capacity": 15,
                "opening_time": "10:00",
                "closing_time": "22:00"
            },
            {
                "name": "Quadra de Esportes",
                "description": "Quadra poliesportiva",
                "capacity": 30,
                "opening_time": "06:00",
                "closing_time": "22:00"
            }
        ]
        
        common_areas = []
        for area_data in areas:
            area = CommonArea(
                tenant_id=tenant.id,
                **area_data
            )
            session.add(area)
            common_areas.append(area)
            print(f"  ✓ {area.name} ({area.opening_time} - {area.closing_time})")
        
        await session.flush()
        
        # 4. Criar Reservas - SKIPPED (requer tabela units que não existe ainda)
        # print("\n📅 Criando Reservas...")
        # ... código comentado ...
        
        # 5. Criar Notificações
        print("\n🔔 Criando Notificações...")
        
        now = datetime.utcnow()
        notifications_data = [
            {
                "title": "Assembleia Geral Extraordinária",
                "message": "Convocamos todos os condôminos para a Assembleia Geral Extraordinária no dia 30/11 às 19h no salão de festas.",
                "days_ago": 1
            },
            {
                "title": "Manutenção Preventiva - Elevadores",
                "message": "Os elevadores da Torre A estarão em manutenção preventiva no dia 25/11 das 08h às 12h. Pedimos compreensão.",
                "days_ago": 2
            },
            {
                "title": "Novo Horário da Portaria",
                "message": "A partir de 01/12, a portaria funcionará 24h com equipe completa de segurança.",
                "days_ago": 3
            },
            {
                "title": "Limpeza da Caixa d'Água",
                "message": "Limpeza programada da caixa d'água para 28/11. Pode haver interrupção temporária no fornecimento.",
                "days_ago": 4
            },
            {
                "title": "Festa Junina do Condomínio",
                "message": "Participe da festa junina no dia 15/12 no salão de festas. Haverá comidas típicas e quadrilha!",
                "days_ago": 5
            },
            {
                "title": "Regras para Animais de Estimação",
                "message": "Lembramos que animais devem circular pelas áreas comuns sempre com coleira e na companhia do responsável.",
                "days_ago": 6
            },
            {
                "title": "Reforma da Academia",
                "message": "A academia do condomínio está em reforma e reabrirá em janeiro com novos equipamentos.",
                "days_ago": 7
            },
            {
                "title": "Campanha de Reciclagem",
                "message": "Participe da campanha de reciclagem! Coletores específicos foram instalados no térreo.",
                "days_ago": 8
            },
            {
                "title": "Manutenção da Piscina",
                "message": "A piscina estará fechada para manutenção nos dias 20 e 21 de novembro.",
                "days_ago": 9
            },
            {
                "title": "Novo Aplicativo do Condomínio",
                "message": "Baixe o novo aplicativo SindicoAI para facilitar sua comunicação com a administração!",
                "days_ago": 10
            }
        ]
        
        for notif_data in notifications_data:
            created_at = now - timedelta(days=notif_data["days_ago"])
            notification = Notification(
                user_id=resident.id,
                title=notif_data["title"],
                message=notif_data["message"],
                is_read=notif_data["days_ago"] > 5,  # Marcar antigas como lidas
                tenant_id=tenant.id
            )
            session.add(notification)
            status = "✓" if notification.is_read else "●"
            print(f"  {status} {notif_data['title']}")
        
        # Commit final
        await session.commit()
        
        print("\n" + "="*70)
        print("✅ Seed concluído com sucesso!")
        print("="*70)
        print("\n CREDENCIAIS DE ACESSO:\n")
        print(" ADMIN:")
        print(f"   Email: admin@prime.com")
        print(f"   Senha: admin123\n")
        print(" MORADOR:")
        print(f"   Email: morador@prime.com")
        print(f"   Senha: morador123\n")
        print(" FUNCIONÁRIO:")
        print(f"   Email: funcionario@prime.com")
        print(f"   Senha: func123\n")
        print("="*70)
    
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed_data())
