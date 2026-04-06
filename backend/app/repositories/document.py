from typing import Optional
from sqlalchemy import select, delete
from app.models.document import Document, DocumentCategory, DocumentChunk
from app.repositories.base import BaseRepository


class DocumentRepository(BaseRepository[Document]):
    model = Document

    async def get_by_id_any_tenant(self, document_id: str) -> Document | None:
        result = await self.db.execute(select(Document).where(Document.id == document_id))
        return result.scalars().first()

    async def list_with_filters(
        self,
        tenant_id: str,
        page: int,
        page_size: int,
        category: Optional[DocumentCategory] = None,
        status: Optional[str] = None,
    ) -> tuple[list[Document], int]:
        base = select(Document).where(Document.tenant_id == tenant_id)
        if category:
            base = base.where(Document.category == category)
        if status:
            base = base.where(Document.status == status)
        base = base.order_by(Document.upload_date.desc())
        return await self.list_paginated(tenant_id, page, page_size, base_query=base)

    async def delete_chunks(self, document_id: str) -> None:
        await self.db.execute(
            delete(DocumentChunk).where(DocumentChunk.document_id == document_id)
        )
        await self.db.commit()
