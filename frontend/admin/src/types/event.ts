export interface Event {
    id: string
    title: string
    description: string | null
    event_date: string
    start_time: string
    end_time: string
    location: string | null
    common_area_id: string | null
    capacity: number | null
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
    created_at: string
    updated_at: string
    created_by: string
    tenant_id: string
    attendee_count?: number
}

export interface EventCreate {
    title: string
    description?: string
    event_date: string
    start_time: string
    end_time: string
    location?: string
    common_area_id?: string
    capacity?: number
}

export interface EventUpdate {
    title?: string
    description?: string
    event_date?: string
    start_time?: string
    end_time?: string
    location?: string
    common_area_id?: string
    capacity?: number
    status?: string
}

export interface EventRSVP {
    id: string
    event_id: string
    user_id: string
    response: 'attending' | 'declined' | 'maybe'
    attended: boolean
    created_at: string
}
