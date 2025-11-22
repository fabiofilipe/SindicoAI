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
 * Busca reservas do usuário atual
 * Filtra as reservas do usuário logado
 */
export const getMyReservations = async (): Promise<Reservation[]> => {
    const allReservations = await listReservations()
    // Backend já filtra por tenant, aqui filtraríamos por user_id se necessário
    return allReservations
}

/**
 * Get upcoming reservations (next 7 days)
 */
export const getUpcomingReservations = async (): Promise<Reservation[]> => {
    const response = await api.get<Reservation[]>('/reservations')
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    return response.data.filter(r => {
        const startTime = new Date(r.start_time)
        return startTime >= now && startTime <= nextWeek
    }).sort((a, b) => {
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    })
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
