"""
File validation service for document uploads.
Provides comprehensive validation for file size, type, MIME, and integrity.
"""
import magic
from typing import Tuple, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class FileValidator:
    """Validates uploaded files for size, type, and content integrity"""

    @staticmethod
    def validate_file_size(file_size: int) -> Tuple[bool, Optional[str]]:
        """
        Validate file size is within configured limits.

        Args:
            file_size: Size of file in bytes

        Returns:
            Tuple of (is_valid, error_message)
        """
        if file_size > settings.MAX_UPLOAD_SIZE_BYTES:
            size_mb = file_size / (1024 * 1024)
            return False, f"Arquivo muito grande ({size_mb:.2f}MB). Máximo permitido: {settings.MAX_UPLOAD_SIZE_MB}MB"

        if file_size == 0:
            return False, "Arquivo vazio não pode ser enviado"

        return True, None

    @staticmethod
    def validate_file_extension(filename: str) -> Tuple[bool, Optional[str]]:
        """
        Validate file has an allowed extension.

        Args:
            filename: Name of the file

        Returns:
            Tuple of (is_valid, error_message)
        """
        if not filename or '.' not in filename:
            return False, "Nome de arquivo inválido"

        ext = filename.lower().rsplit('.', 1)[-1]
        ext_with_dot = f".{ext}"

        if ext_with_dot not in settings.ALLOWED_EXTENSIONS:
            allowed = ', '.join(settings.ALLOWED_EXTENSIONS)
            return False, f"Tipo de arquivo '.{ext}' não permitido. Tipos aceitos: {allowed}"

        return True, None

    @staticmethod
    async def validate_mime_type(file_content: bytes, filename: str) -> Tuple[bool, Optional[str]]:
        """
        Validate MIME type matches file content (prevents extension spoofing).

        Args:
            file_content: First bytes of the file content
            filename: Name of the file

        Returns:
            Tuple of (is_valid, error_message)
        """
        try:
            # Use python-magic to detect actual MIME type from content
            mime_detector = magic.Magic(mime=True)

            # Check first 2KB of file (enough for MIME detection)
            content_to_check = file_content[:2048]
            detected_mime = mime_detector.from_buffer(content_to_check)

            logger.info(f"Detected MIME type for {filename}: {detected_mime}")

            # Check if detected MIME is in allowed list
            if detected_mime not in settings.ALLOWED_MIME_TYPES:
                return False, f"Tipo de conteúdo '{detected_mime}' não permitido"

            # Verify extension matches MIME type
            ext = filename.lower().rsplit('.', 1)[-1] if '.' in filename else ''
            ext_with_dot = f".{ext}"

            allowed_exts = settings.ALLOWED_MIME_TYPES.get(detected_mime, [])
            if ext_with_dot not in allowed_exts:
                return False, f"Extensão '.{ext}' não corresponde ao conteúdo do arquivo (detectado: {detected_mime})"

            return True, None

        except Exception as e:
            logger.error(f"Error validating MIME type: {e}")
            return False, f"Erro ao validar tipo de arquivo: {str(e)}"

    @staticmethod
    async def validate_file_integrity(file_path: str, file_type: str) -> Tuple[bool, Optional[str]]:
        """
        Verify file can be opened and is not corrupted.

        Args:
            file_path: Path to the saved file
            file_type: File extension (pdf, xlsx, xls)

        Returns:
            Tuple of (is_valid, error_message)
        """
        try:
            if file_type == "pdf":
                # Try to open PDF and access its structure
                import pdfplumber
                with pdfplumber.open(file_path) as pdf:
                    # Try to access pages (will fail if corrupted)
                    num_pages = len(pdf.pages)
                    if num_pages == 0:
                        return False, "PDF não contém páginas"

                    logger.info(f"PDF validation successful: {num_pages} pages")

            elif file_type in ["xlsx", "xls"]:
                # Try to open Excel file and read headers
                import pandas as pd

                # Just read headers (nrows=0) to validate structure
                excel_file = pd.ExcelFile(file_path)

                if len(excel_file.sheet_names) == 0:
                    return False, "Planilha não contém abas"

                # Try to read first sheet headers
                _ = pd.read_excel(file_path, nrows=0)

                logger.info(f"Excel validation successful: {len(excel_file.sheet_names)} sheets")

            else:
                return False, f"Tipo de arquivo '{file_type}' não suportado para validação de integridade"

            return True, None

        except Exception as e:
            logger.error(f"File integrity check failed for {file_path}: {e}")
            return False, f"Arquivo corrompido ou ilegível: {str(e)}"

    @classmethod
    async def validate_all(
        cls,
        file_content: bytes,
        filename: str,
        file_path: Optional[str] = None
    ) -> Tuple[bool, Optional[str]]:
        """f
        Run all validations on a file.

        Args:
            file_content: Content of the file
            filename: Name of the file
            file_path: Path to saved file (optional, for integrity check)

        Returns:
            Tuple of (is_valid, error_message)
        """
        # 1. Size validation
        is_valid, error = cls.validate_file_size(len(file_content))
        if not is_valid:
            return False, error

        # 2. Extension validation
        is_valid, error = cls.validate_file_extension(filename)
        if not is_valid:
            return False, error

        # 3. MIME type validation
        is_valid, error = await cls.validate_mime_type(file_content, filename)
        if not is_valid:
            return False, error

        # 4. Integrity validation (if file is saved)
        if file_path:
            ext = filename.lower().rsplit('.', 1)[-1] if '.' in filename else ''
            is_valid, error = await cls.validate_file_integrity(file_path, ext)
            if not is_valid:
                return False, error

        return True, None
