// ─── Common Area ─────────────────────────────────────────────────────────────

export interface CommonArea {
    id: string
    name: string
    description: string | null
    capacity: number | null
    opening_time: string | null
    closing_time: string | null
    is_active: boolean
    tenant_id: string
}

export interface CommonAreaCreate {
    name: string
    description?: string | null
    capacity?: number | null
    opening_time?: string | null
    closing_time?: string | null
    is_active?: boolean
}

export interface CommonAreaUpdate {
    name?: string
    description?: string | null
    capacity?: number | null
    opening_time?: string | null
    closing_time?: string | null
    is_active?: boolean
}

// ─── Unit ─────────────────────────────────────────────────────────────────────

export interface Unit {
    id: string
    number: string
    block: string | null
    floor: number | null
    type: string | null
    tenant_id: string
    created_at: string
    updated_at: string
}

export interface UnitCreate {
    number: string
    block?: string | null
    floor?: number | null
    type?: string | null
}

export interface UnitUpdate {
    number?: string
    block?: string | null
    floor?: number | null
    type?: string | null
}

export interface UserSimple {
    id: string
    full_name: string
    email: string
    role: string
}

export interface UnitWithResidents extends Unit {
    residents: UserSimple[]
}

export interface AssignUserRequest {
    user_id: string
}

export interface CSVImportResponse {
    total_rows: number
    created: number
    skipped: number
    errors: string[]
}

// ─── User (management) ───────────────────────────────────────────────────────

export interface UserListItem {
    id: string
    email: string
    full_name?: string
    cpf?: string
    role: 'admin' | 'resident' | 'staff'
    is_active: boolean
    tenant_id: string
    unit_id?: string
    created_at: string
    updated_at: string
}

export interface CreateUserRequest {
    email: string
    password: string
    full_name?: string
    cpf?: string
    role: 'admin' | 'resident' | 'staff'
    is_active?: boolean
    unit_id?: string
}

export interface UpdateUserRequest {
    email?: string
    full_name?: string
    cpf?: string
    role?: 'admin' | 'resident' | 'staff'
    is_active?: boolean
    unit_id?: string
}

export interface ResetPasswordRequest {
    new_password: string
}

// ─── Reservation ─────────────────────────────────────────────────────────────

export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled' | 'in-progress' | 'completed'

export interface Reservation {
    id: string
    common_area_id: string
    user_id: string
    unit_id?: string
    start_time: string
    end_time: string
    status: ReservationStatus
    tenant_id: string
    created_at: string
    updated_at: string
}

export interface ReservationCreate {
    common_area_id: string
    start_time: string
    end_time: string
}

// ─── Notification ────────────────────────────────────────────────────────────

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

// ─── Event ───────────────────────────────────────────────────────────────────

export type EventStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled'

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
    status: EventStatus
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

export interface EventRSVPCreate {
    response: 'attending' | 'declined' | 'maybe'
}
