export type ImportType = 'units' | 'users' | 'payments' | 'meters'
export type ImportStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface ImportJob {
    id: string
    tenant_id: string
    user_id: string
    uploader_name?: string
    type: ImportType
    filename: string
    total_rows: number
    processed_rows: number
    successful_rows: number
    failed_rows: number
    status: ImportStatus
    error_message?: string
    errors?: ImportError[]
    created_at: string
    completed_at?: string
}

export interface ImportError {
    row: number
    field?: string
    message: string
}

export interface ImportPreview {
    headers: string[]
    rows: string[][]
    total_rows: number
}

export interface CreateImportInput {
    file: File
    type: ImportType
}
