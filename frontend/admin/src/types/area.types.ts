export interface CommonArea {
    id: string
    tenant_id: string
    name: string
    description?: string
    capacity: number
    available_hours_start?: string
    available_hours_end?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface CreateCommonAreaInput {
    name: string
    description?: string
    capacity: number
    available_hours_start?: string
    available_hours_end?: string
}

export interface UpdateCommonAreaInput {
    name?: string
    description?: string
    capacity?: number
    available_hours_start?: string
    available_hours_end?: string
    is_active?: boolean
}
