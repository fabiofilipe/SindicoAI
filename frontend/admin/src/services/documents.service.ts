import api from './api'
import { Document, UpdateDocumentInput } from '@/types/document.types'

export const documentsService = {
    /**
     * Get all documents
     * GET /api/v1/documents
     */
    getAll: async (): Promise<Document[]> => {
        const response = await api.get<Document[]>('/documents')
        return response.data
    },

    /**
     * Get document by ID
     * GET /api/v1/documents/{id}
     */
    getById: async (id: string): Promise<Document> => {
        const response = await api.get<Document>(`/documents/${id}`)
        return response.data
    },

    /**
     * Get documents by category
     * GET /api/v1/documents/category/{category}
     */
    getByCategory: async (category: string): Promise<Document[]> => {
        const response = await api.get<Document[]>(`/documents/category/${category}`)
        return response.data
    },

    /**
     * Upload document
     * POST /api/v1/documents/upload
     */
    upload: async (formData: FormData): Promise<Document> => {
        const response = await api.post<Document>('/documents/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    },

    /**
     * Update document metadata
     * PUT /api/v1/documents/{id}
     */
    update: async (id: string, data: UpdateDocumentInput): Promise<Document> => {
        const response = await api.put<Document>(`/documents/${id}`, data)
        return response.data
    },

    /**
     * Download document
     * GET /api/v1/documents/{id}/download
     */
    download: async (id: string): Promise<Blob> => {
        const response = await api.get(`/documents/${id}/download`, {
            responseType: 'blob',
        })
        return response.data
    },

    /**
     * Delete document
     * DELETE /api/v1/documents/{id}
     */
    delete: async (id: string): Promise<void> => {
        await api.delete(`/documents/${id}`)
    },

    /**
     * Archive document
     * PUT /api/v1/documents/{id}/archive
     */
    archive: async (id: string): Promise<void> => {
        await api.put(`/documents/${id}/archive`)
    },
}
