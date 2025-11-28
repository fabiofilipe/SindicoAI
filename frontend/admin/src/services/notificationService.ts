import api from './api'
import type { Notification, NotificationCreate } from '@/types/notification'

/**
 * Serviço de Notificações - Admin
 * Gerencia o envio em massa de notificações
 */

/**
 * Cria e envia notificações em massa
 * Pode enviar para todos, para unidades específicas ou para usuários específicos
 */
export const createNotification = async (data: NotificationCreate): Promise<Notification[]> => {
    const response = await api.post<Notification[]>('/notifications/', data)
    return response.data
}

/**
 * Lista todas as notificações do sistema (para histórico de envios)
 * Nota: Este endpoint lista as notificações do usuário atual (admin)
 */
export const listNotifications = async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>('/notifications/')
    return response.data
}

/**
 * Deleta uma notificação
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
    await api.delete(`/notifications/${notificationId}`)
}
