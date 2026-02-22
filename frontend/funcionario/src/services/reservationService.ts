import api from './api'
import type { Reservation, ReservationCreate } from '@/types/models'

/**
 * Serviço de Reservas
 * Gerencia reservas de áreas comuns
 */

/**
 * Lista todas as reservas do tenant atual
 */
export const listReservations = async (): Promise<Reservation[]> => {
    const response = await api.get<Reservation[]>('/reservations/')
    return response.data
}

/**
 * Busca uma reserva específica por ID
 */
export const getReservation = async (id: string): Promise<Reservation> => {
    const response = await api.get<Reservation>(`/reservations/${id}`)
    return response.data
}

/**
 * Cria uma nova reserva
 */
export const createReservation = async (
    data: ReservationCreate
): Promise<Reservation> => {
    const response = await api.post<Reservation>('/reservations/', data)
    return response.data
}

/**
 * Cancela uma reserva
 */
export const cancelReservation = async (id: string): Promise<void> => {
    await api.delete(`/reservations/${id}`)
}


/**
 * Get reservation details by ID
 */
export const getReservationDetails = async (id: string): Promise<Reservation> => {
    const response = await api.get<Reservation>(`/reservations/${id}`)
    return response.data
}

/**
 * Start a reservation (staff only)
 */
export const startReservation = async (id: string): Promise<Reservation> => {
    const response = await api.put<Reservation>(`/reservations/${id}/start`)
    return response.data
}

/**
 * Complete a reservation (staff only)
 */
export const completeReservation = async (id: string): Promise<Reservation> => {
    const response = await api.put<Reservation>(`/reservations/${id}/complete`)
    return response.data
}

/**
 * Report an issue with a reservation (staff only)
 */
export const reportReservationIssue = async (
    id: string,
    data: { description: string; severity: string }
): Promise<{ message: string; notifications_created: number }> => {
    const response = await api.post(`/reservations/${id}/report-issue`, data)
    return response.data
}
