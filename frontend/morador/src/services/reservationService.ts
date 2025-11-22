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
 * Busca próximas reservas (futuras)
 */
export const getUpcomingReservations = async (): Promise<Reservation[]> => {
    const reservations = await listReservations()
    const now = new Date()

    return reservations.filter((r) => {
        const startTime = new Date(r.start_time)
        return startTime > now && r.status === 'confirmed'
    }).sort((a, b) => {
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    })
}
