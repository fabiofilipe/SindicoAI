export interface DashboardMetrics {
    total_users: number
    total_residents: number
    total_staff: number
    total_admins: number
    total_reservations: number
    total_areas: number
    active_reservations: number
    recent_users: number
}

export interface RecentActivity {
    id: string
    type: 'reservation' | 'user' | 'notification'
    description: string
    timestamp: string
    user?: {
        id: string
        name: string
    }
}
