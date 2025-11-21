import api from './api'
import { Unit, CreateUnitInput, UpdateUnitInput } from '@/types/unit.types'
import { PaginatedResponse, PaginationParams } from '@/types/api.types'

export const unitsService = {
    /**
     * Get all units with pagination and filters
     * GET /api/v1/units
     */
    getAll: async (params?: PaginationParams & { type?: string; status?: string; search?: string }): Promise<PaginatedResponse<Unit>> => {
        const response = await api.get<PaginatedResponse<Unit>>('/units', { params })
        return response.data
    },

    /**
     * Get unit by ID
     * GET /api/v1/units/{id}
     */
    getById: async (id: string): Promise<Unit> => {
        const response = await api.get<Unit>(`/units/${id}`)
        return response.data
    },

    /**
     * Create new unit
     * POST /api/v1/units
     */
    create: async (data: CreateUnitInput): Promise<Unit> => {
        const response = await api.post<Unit>('/units', data)
        return response.data
    },

    /**
     * Update unit
     * PUT /api/v1/units/{id}
     */
    update: async (id: string, data: UpdateUnitInput): Promise<Unit> => {
        const response = await api.put<Unit>(`/units/${id}`, data)
        return response.data
    },

    /**
     * Delete unit
     * DELETE /api/v1/units/{id}
     */
    delete: async (id: string): Promise<void> => {
        await api.delete(`/units/${id}`)
    },
}
