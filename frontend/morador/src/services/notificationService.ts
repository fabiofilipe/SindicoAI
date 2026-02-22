import api from './api'
import type { Notification } from '@/types/models'

/**
 * Serviço de Notificações
 * Gerencia notificações do usuário
 */

/**
 * Lista todas as notificações do usuário
 * @param unread - Se true, retorna apenas não lidas; se false, apenas lidas; se undefined, retorna todas
 */
export const listNotifications = async (
    unread?: boolean
): Promise<Notification[]> => {
    const params = unread !== undefined ? { unread } : {}
    const response = await api.get<Notification[]>('/notifications/', { params })
    return response.data
}

/**
 * Marca uma notificação como lida
 */
export const markAsRead = async (id: string): Promise<Notification> => {
    const response = await api.put<Notification>(`/notifications/${id}/read`)
    return response.data
}

/**
 * Deleta uma notificação
 */
export const deleteNotification = async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`)
}

/**
 * Busca contagem de notificações não lidas
 */
export const getUnreadCount = async (): Promise<number> => {
    const notifications = await listNotifications(true)
    return notifications.length
}

