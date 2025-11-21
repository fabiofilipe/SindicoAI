export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'system'
export type NotificationStatus = 'unread' | 'read' | 'archived'
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface Notification {
    id: string
    tenant_id: string
    user_id?: string
    type: NotificationType
    priority: NotificationPriority
    title: string
    message: string
    status: NotificationStatus
    action_url?: string
    action_label?: string
    metadata?: Record<string, any>
    created_at: string
    read_at?: string
}

export interface CreateNotificationInput {
    user_id?: string
    type: NotificationType
    priority: NotificationPriority
    title: string
    message: string
    action_url?: string
    action_label?: string
    metadata?: Record<string, any>
}

export interface UpdateNotificationInput {
    status?: NotificationStatus
}
