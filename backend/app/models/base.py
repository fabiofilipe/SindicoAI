"""
Backward-compatibility shim for imports of `app.models.base`.

All domain models now live in separate files under `app/models/`.
This module re-exports everything so existing imports continue to work.

New code should import from the domain-specific modules directly:
    from app.models.core import Tenant, User, UserRole
    from app.models.unit import Unit
    from app.models.common_area import CommonArea
    from app.models.reservation import Reservation
    from app.models.notification import Notification
    from app.models.event import Event, EventRSVP
"""

# noqa: F401, F403 — re-export everything for backward compatibility

from app.core.uuid import generate_uuid  # noqa: F401
from app.models.core import Tenant, User, UserRole  # noqa: F401
from app.models.unit import Unit  # noqa: F401
from app.models.common_area import CommonArea  # noqa: F401
from app.models.reservation import Reservation  # noqa: F401
from app.models.notification import Notification  # noqa: F401
from app.models.event import Event, EventRSVP  # noqa: F401
