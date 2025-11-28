export interface Notification {
    id: string
    title: string
    message: string
    user_id: string
    is_read: boolean
    tenant_id: string
    created_at: string
    updated_at: string
}

export interface NotificationCreate {
    title: string
    message: string
    send_to_all?: boolean
    user_ids?: string[]
    unit_ids?: string[]
}

export interface NotificationSendResult {
    success: boolean
    count: number
    notifications: Notification[]
}
