from fastapi import APIRouter

api_router = APIRouter()

from app.api.routes import auth, common_areas, reservations, notifications, imports, register, onboarding, units, users, documents, ai, reports, settings, audit, websocket, events

api_router.include_router(onboarding.router, prefix="/public", tags=["public"])  # No auth required
api_router.include_router(register.router, prefix="/public", tags=["public"])  # No auth required
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(units.router, prefix="/units", tags=["units"])
api_router.include_router(common_areas.router, prefix="/common-areas", tags=["common-areas"])
api_router.include_router(reservations.router, prefix="/reservations", tags=["reservations"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
api_router.include_router(imports.router, prefix="/import", tags=["import"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(audit.router, prefix="/admin", tags=["admin"])
api_router.include_router(websocket.router, tags=["websocket"])

