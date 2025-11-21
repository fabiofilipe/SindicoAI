import api from './api'
import { CommonArea, CreateCommonAreaInput, UpdateCommonAreaInput } from '@/types/area.types'

export const areasService = {
    /**
     * Get all common areas
     * GET /api/v1/common-areas
     */
    getAll: async (): Promise<CommonArea[]> => {
        const response = await api.get<CommonArea[]>('/common-areas')
        return response.data
    },

    /**
     * Get common area by ID
     * GET /api/v1/common-areas/{id}
     */
    getById: async (id: string): Promise<CommonArea> => {
        const response = await api.get<CommonArea>(`/common-areas/${id}`)
        return response.data
    },

    /**
     * Create new common area
     * POST /api/v1/common-areas
     */
    create: async (data: CreateCommonAreaInput): Promise<CommonArea> => {
        const response = await api.post<CommonArea>('/common-areas', data)
        return response.data
    },

    /**
     * Update common area
     * PUT /api/v1/common-areas/{id}
     */
    update: async (id: string, data: UpdateCommonAreaInput): Promise<CommonArea> => {
        const response = await api.put<CommonArea>(`/common-areas/${id}`, data)
        return response.data
    },

    /**
     * Delete common area
     * DELETE /api/v1/common-areas/{id}
     */
    delete: async (id: string): Promise<void> => {
        await api.delete(`/common-areas/${id}`)
    },
}
