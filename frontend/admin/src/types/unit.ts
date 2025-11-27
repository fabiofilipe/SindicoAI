// Types for Unit management (matching backend schemas)

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
