from typing import Any


class AppException(Exception):
    """Base exception for all application errors."""

    status_code: int = 500
    default_message: str = "An unexpected error occurred"

    def __init__(self, message: str | None = None, detail: Any = None):
        self.message = message or self.default_message
        self.detail = detail
        super().__init__(self.message)


class NotFoundError(AppException):
    status_code = 404
    default_message = "Resource not found"


class ConflictError(AppException):
    status_code = 409
    default_message = "Resource already exists"


class AuthenticationError(AppException):
    status_code = 401
    default_message = "Authentication failed"


class AuthorizationError(AppException):
    status_code = 403
    default_message = "Permission denied"


class ValidationError(AppException):
    status_code = 422
    default_message = "Validation error"


class UnprocessableError(AppException):
    status_code = 422
    default_message = "Unable to process request"


class ExternalServiceError(AppException):
    status_code = 502
    default_message = "External service error"
