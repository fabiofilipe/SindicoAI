from fastapi import APIRouter

api_router = APIRouter()

from app.api.routes import auth, common_areas, reservations, notifications, imports, register, onboarding

api_router.include_router(onboarding.router, prefix="/public", tags=["public"])  # No auth required
api_router.include_router(register.router, prefix="/public", tags=["public"])  # No auth required
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(common_areas.router, prefix="/common-areas", tags=["common-areas"])
api_router.include_router(reservations.router, prefix="/reservations", tags=["reservations"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(imports.router, prefix="/import", tags=["import"])

