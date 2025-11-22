// ============================================
// Tipos baseados nos models do backend
// ============================================

export interface CommonArea {
    id: string
    name: string
    description?: string
    capacity?: number
    hourly_rate?: number
    tenant_id: string
    created_at: string
    updated_at: string
}

export interface Reservation {
    id: string
    common_area_id: string
    user_id: string
    unit_id?: string
    start_time: string
    end_time: string
    status: 'confirmed' | 'pending' | 'cancelled' | 'in-progress' | 'completed'
    tenant_id: string
    created_at: string
    updated_at: string
}

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

// ============================================
// Request/Response types
// ============================================

export interface ReservationCreate {
    common_area_id: string
    start_time: string // ISO 8601 format
    end_time: string // ISO 8601 format
}

export interface NotificationCreate {
    title: string
    message: string
    send_to_all?: boolean
    user_ids?: string[]
    unit_ids?: string[]
}

export interface CommonAreaCreate {
    name: string
    description?: string
    capacity?: number
    hourly_rate?: number
}

// ============================================
// Dashboard data types
// ============================================

export interface DashboardData {
    upcomingReservations: Reservation[]
    recentNotifications: Notification[]
    unreadNotificationsCount: number
}
