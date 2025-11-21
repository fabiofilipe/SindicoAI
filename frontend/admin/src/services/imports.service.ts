import api from './api'
import { ImportJob, ImportPreview } from '@/types/import.types'

export const importsService = {
    /**
     * Get all import jobs
     * GET /api/v1/imports
     */
    getAll: async (): Promise<ImportJob[]> => {
        const response = await api.get<ImportJob[]>('/imports')
        return response.data
    },

    /**
     * Get import job by ID
     * GET /api/v1/imports/{id}
     */
    getById: async (id: string): Promise<ImportJob> => {
        const response = await api.get<ImportJob>(`/imports/${id}`)
        return response.data
    },

    /**
     * Preview CSV file before import
     * POST /api/v1/imports/preview
     */
    preview: async (file: File): Promise<ImportPreview> => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await api.post<ImportPreview>('/imports/preview', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    },

    /**
     * Upload and process CSV import
     * POST /api/v1/imports/upload
     */
    upload: async (file: File, type: string): Promise<ImportJob> => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type)

        const response = await api.post<ImportJob>('/imports/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    },

    /**
     * Delete import job
     * DELETE /api/v1/imports/{id}
     */
    delete: async (id: string): Promise<void> => {
        await api.delete(`/imports/${id}`)
    },
}
