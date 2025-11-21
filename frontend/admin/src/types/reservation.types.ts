export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface Reservation {
    id: string
    tenant_id: string
    common_area_id: string
    common_area_name?: string
    user_id: string
    user_name?: string
    unit_number?: string
    reservation_date: string
    start_time: string
    end_time: string
    status: ReservationStatus
    guests_count?: number
    notes?: string
    created_at: string
    updated_at: string
}

export interface CreateReservationInput {
    common_area_id: string
    reservation_date: string
    start_time: string
    end_time: string
    guests_count?: number
    notes?: string
}

export interface UpdateReservationInput {
    reservation_date?: string
    start_time?: string
    end_time?: string
    guests_count?: number
    notes?: string
    status?: ReservationStatus
}
