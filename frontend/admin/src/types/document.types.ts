export type DocumentType = 'pdf' | 'image' | 'spreadsheet' | 'other'
export type DocumentCategory = 'contract' | 'invoice' | 'meeting_minutes' | 'regulation' | 'report' | 'other'
export type DocumentStatus = 'active' | 'archived' | 'deleted'

export interface Document {
    id: string
    tenant_id: string
    name: string
    description?: string
    file_path: string
    file_size: number
    file_type: string
    document_type: DocumentType
    category: DocumentCategory
    status: DocumentStatus
    uploaded_by: string
    uploader_name?: string
    is_public: boolean
    tags?: string[]
    created_at: string
    updated_at: string
}

export interface UploadDocumentInput {
    file: File
    description?: string
    category: DocumentCategory
    is_public: boolean
    tags?: string[]
}

export interface UpdateDocumentInput {
    name?: string
    description?: string
    category?: DocumentCategory
    is_public?: boolean
    tags?: string[]
    status?: DocumentStatus
}
