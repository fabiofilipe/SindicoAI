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
