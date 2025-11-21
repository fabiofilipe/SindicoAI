export type UnitType = 'apartment' | 'house' | 'commercial'
export type UnitStatus = 'occupied' | 'vacant'

export interface Unit {
    id: string
    tenant_id: string
    number: string
    type: UnitType
    area: number
    floor?: string
    block?: string
    status: UnitStatus
    residents_count: number
    created_at: string
    updated_at: string
}

export interface CreateUnitInput {
    number: string
    type: UnitType
    area: number
    floor?: string
    block?: string
}

export interface UpdateUnitInput {
    number?: string
    type?: UnitType
    area?: number
    floor?: string
    block?: string
    status?: UnitStatus
}
