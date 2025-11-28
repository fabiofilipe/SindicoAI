// ============================================
// Common Areas Usage Report
// ============================================

export interface CommonAreaUsageStats {
    common_area_id: string
    common_area_name: string
    total_reservations: number
    total_hours_reserved: number
    most_popular_day: string | null
    average_duration_hours: number | null
}

export interface CommonAreasUsageReport {
    start_date: string // YYYY-MM-DD
    end_date: string // YYYY-MM-DD
    total_reservations: number
    total_areas_used: number
    areas_stats: CommonAreaUsageStats[]
}

// ============================================
// Reservations Report
// ============================================

export interface ReservationReportItem {
    id: string
    common_area_name: string
    user_name: string
    user_email: string
    unit_number: string | null
    start_time: string // ISO 8601
    end_time: string // ISO 8601
    status: string
    duration_hours: number
    created_at: string // ISO 8601
}

export interface ReservationsReport {
    start_date: string // YYYY-MM-DD
    end_date: string // YYYY-MM-DD
    total_reservations: number
    confirmed_count: number
    pending_count: number
    cancelled_count: number
    total_hours_reserved: number
    reservations: ReservationReportItem[]
}

// ============================================
// Report Filters
// ============================================

export interface ReportFilters {
    start_date?: string
    end_date?: string
    status?: 'confirmed' | 'pending' | 'cancelled'
    common_area_id?: string
}
