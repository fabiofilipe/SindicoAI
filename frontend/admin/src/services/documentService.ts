import api from './api'
import type {
    Document,
    DocumentUploadResponse,
    DocumentListResponse,
    DocumentCategory
} from '../types/document'

/**
 * Upload de múltiplos documentos
 */
export const uploadDocuments = async (
    files: File[],
    category: DocumentCategory
): Promise<DocumentUploadResponse> => {
    const formData = new FormData()

    // Adicionar todos os arquivos ao FormData
    files.forEach(file => {
        formData.append('files', file)
    })

    const response = await api.post(
        `/documents/upload?category=${category}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    )
    return response.data
}

/**
 * Listar documentos com filtros opcionais
 */
export const listDocuments = async (
    category?: DocumentCategory,
    status?: string
): Promise<DocumentListResponse> => {
    const params = new URLSearchParams()

    if (category) {
        params.append('category', category)
    }
    if (status) {
        params.append('status', status)
    }

    const queryString = params.toString()
    const url = queryString ? `/documents/?${queryString}` : '/documents/'

    const response = await api.get(url)
    return response.data
}

/**
 * Obter detalhes de um documento específico
 */
export const getDocument = async (id: string): Promise<Document> => {
    const response = await api.get(`/documents/${id}`)
    return response.data
}

/**
 * Deletar documento
 */
export const deleteDocument = async (id: string): Promise<void> => {
    await api.delete(`/documents/${id}`)
}

/**
 * Fazer download de um documento
 */
export const downloadDocument = async (id: string, filename: string): Promise<void> => {
    const response = await api.get(`/documents/${id}/download`, {
        responseType: 'blob'
    })

    // Criar link temporário para download
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}
