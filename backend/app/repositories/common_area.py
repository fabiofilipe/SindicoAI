from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import CommonArea
from .base import BaseRepository


class CommonAreaRepository(BaseRepository[CommonArea]):
    model = CommonArea

    def __init__(self, db: AsyncSession):
        super().__init__(db)
