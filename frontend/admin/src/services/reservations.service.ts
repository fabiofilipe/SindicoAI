import api from './api'
import { Reservation, CreateReservationInput, UpdateReservationInput } from '@/types/reservation.types'

export const reservationsService = {
    /**
     * Get all reservations
     * GET /api/v1/reservations
     */
    getAll: async (): Promise<Reservation[]> => {
        const response = await api.get<Reservation[]>('/reservations')
        return response.data
    },

    /**
     * Get reservation by ID
     * GET /api/v1/reservations/{id}
     */
    getById: async (id: string): Promise<Reservation> => {
        const response = await api.get<Reservation>(`/reservations/${id}`)
        return response.data
    },

    /**
     * Get reservations by common area
     * GET /api/v1/reservations/common-area/{area_id}
     */
    getByArea: async (areaId: string): Promise<Reservation[]> => {
        const response = await api.get<Reservation[]>(`/reservations/common-area/${areaId}`)
        return response.data
    },

    /**
     * Get reservations by date range
     * GET /api/v1/reservations/date-range
     */
    getByDateRange: async (startDate: string, endDate: string): Promise<Reservation[]> => {
        const response = await api.get<Reservation[]>('/reservations/date-range', {
            params: { start_date: startDate, end_date: endDate }
        })
        return response.data
    },

    /**
     * Create new reservation
     * POST /api/v1/reservations
     */
    create: async (data: CreateReservationInput): Promise<Reservation> => {
        const response = await api.post<Reservation>('/reservations', data)
        return response.data
    },

    /**
     * Update reservation
     * PUT /api/v1/reservations/{id}
     */
    update: async (id: string, data: UpdateReservationInput): Promise<Reservation> => {
        const response = await api.put<Reservation>(`/reservations/${id}`, data)
        return response.data
    },

    /**
     * Cancel reservation
     * PUT /api/v1/reservations/{id}/cancel
     */
    cancel: async (id: string): Promise<void> => {
        await api.put(`/reservations/${id}/cancel`)
    },

    /**
     * Delete reservation
     * DELETE /api/v1/reservations/{id}
     */
    delete: async (id: string): Promise<void> => {
        await api.delete(`/reservations/${id}`)
    },
}
