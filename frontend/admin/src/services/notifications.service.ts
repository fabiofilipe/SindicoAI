import api from './api'
import { Notification, CreateNotificationInput } from '@/types/notification.types'

export const notificationsService = {
    /**
     * Get all notifications for current user
     * GET /api/v1/notifications
     */
    getAll: async (): Promise<Notification[]> => {
        const response = await api.get<Notification[]>('/notifications')
        return response.data
    },

    /**
     * Get unread notifications count
     * GET /api/v1/notifications/unread/count
     */
    getUnreadCount: async (): Promise<number> => {
        const response = await api.get<{ count: number }>('/notifications/unread/count')
        return response.data.count
    },

    /**
     * Get notification by ID
     * GET /api/v1/notifications/{id}
     */
    getById: async (id: string): Promise<Notification> => {
        const response = await api.get<Notification>(`/notifications/${id}`)
        return response.data
    },

    /**
     * Create notification (admin only)
     * POST /api/v1/notifications
     */
    create: async (data: CreateNotificationInput): Promise<Notification> => {
        const response = await api.post<Notification>('/notifications', data)
        return response.data
    },

    /**
     * Mark notification as read
     * PUT /api/v1/notifications/{id}/read
     */
    markAsRead: async (id: string): Promise<void> => {
        await api.put(`/notifications/${id}/read`)
    },

    /**
     * Mark all notifications as read
     * PUT /api/v1/notifications/read-all
     */
    markAllAsRead: async (): Promise<void> => {
        await api.put('/notifications/read-all')
    },

    /**
     * Archive notification
     * PUT /api/v1/notifications/{id}/archive
     */
    archive: async (id: string): Promise<void> => {
        await api.put(`/notifications/${id}/archive`)
    },

    /**
     * Delete notification
     * DELETE /api/v1/notifications/{id}
     */
    delete: async (id: string): Promise<void> => {
        await api.delete(`/notifications/${id}`)
    },
}
