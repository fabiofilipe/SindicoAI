"""
Models package.

Re-exports all domain models so consumers can import from `app.models` or
`app.models.base` interchangeably.
"""

from app.core.uuid import generate_uuid  # noqa: F401
from app.models.core import Tenant, User, UserRole  # noqa: F401
from app.models.unit import Unit  # noqa: F401
from app.models.common_area import CommonArea  # noqa: F401
from app.models.reservation import Reservation  # noqa: F401
from app.models.notification import Notification  # noqa: F401
from app.models.event import Event, EventRSVP  # noqa: F401
from app.models.document import Document, DocumentChunk, DocumentCategory  # noqa: F401
from app.models.audit import AuditLog  # noqa: F401
