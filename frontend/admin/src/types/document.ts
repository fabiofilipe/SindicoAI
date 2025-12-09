/**
 * Types e interfaces para sistema de documentos
 */

export type DocumentCategory =
    | 'regimentos'
    | 'atas'
    | 'comunicados'
    | 'relatorios'
    | 'outros'

export type DocumentStatus =
    | 'uploading'
    | 'processing'
    | 'extracting'
    | 'chunking'
    | 'embedding'
    | 'completed'
    | 'failed'

export interface Document {
    id: string
    filename: string
    file_type: string
    file_size: number
    upload_date: string
    status: DocumentStatus
    category: DocumentCategory
    tenant_id: string
}

export interface FileUploadResult {
    filename: string
    status: 'success' | 'failed'
    document_id?: string
    error?: string
    message: string
}

export interface DocumentUploadResponse {
    total_files: number
    successful: number
    failed: number
    results: FileUploadResult[]
}

export interface DocumentListResponse {
    documents: Document[]
    total: number
}

/**
 * Labels amigáveis para categorias de documentos
 */
export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
    regimentos: 'Regimentos',
    atas: 'Atas',
    comunicados: 'Comunicados',
    relatorios: 'Relatórios',
    outros: 'Outros'
}

/**
 * Labels amigáveis para status de processamento
 */
export const STATUS_LABELS: Record<DocumentStatus, string> = {
    uploading: 'Enviando',
    processing: 'Processando',
    extracting: 'Extraindo texto',
    chunking: 'Fragmentando',
    embedding: 'Gerando embeddings',
    completed: 'Concluído',
    failed: 'Falhou'
}

/**
 * Cores para cada status
 */
export const STATUS_COLORS: Record<DocumentStatus, string> = {
    uploading: 'text-blue-400',
    processing: 'text-yellow-400',
    extracting: 'text-yellow-400',
    chunking: 'text-yellow-400',
    embedding: 'text-yellow-400',
    completed: 'text-green-400',
    failed: 'text-red-400'
}
