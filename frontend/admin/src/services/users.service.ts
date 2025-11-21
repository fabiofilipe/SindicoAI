import api from './api'
import { User } from '@/types/user.types'
import { PaginatedResponse, PaginationParams } from '@/types/api.types'

export const usersService = {
    /**
     * Get all users with pagination and filters
     * GET /api/v1/users
     */
    getAll: async (params?: PaginationParams & { role?: string; is_active?: boolean; search?: string }): Promise<PaginatedResponse<User>> => {
        const response = await api.get<PaginatedResponse<User>>('/users', { params })
        return response.data
    },

    /**
     * Get user by ID
     * GET /api/v1/users/{id}
     */
    getById: async (id: string): Promise<User> => {
        const response = await api.get<User>(`/users/${id}`)
        return response.data
    },

    /**
     * Activate user
     * PUT /api/v1/users/{id}/activate
     */
    activate: async (id: string): Promise<User> => {
        const response = await api.put<User>(`/users/${id}/activate`)
        return response.data
    },

    /**
     * Deactivate user
     * PUT /api/v1/users/{id}/deactivate
     */
    deactivate: async (id: string): Promise<User> => {
        const response = await api.put<User>(`/users/${id}/deactivate`)
        return response.data
    },

    /**
     * Reset user password
     * PUT /api/v1/users/{id}/reset-password
     */
    resetPassword: async (id: string): Promise<{ temporary_password: string }> => {
        const response = await api.put<{ temporary_password: string }>(`/users/${id}/reset-password`)
        return response.data
    },
}
