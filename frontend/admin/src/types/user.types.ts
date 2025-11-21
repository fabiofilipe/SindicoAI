export type UserRole = 'admin' | 'resident' | 'employee'

export interface User {
    id: string
    email: string
    full_name: string
    role: UserRole
    tenant_id: string
    is_active: boolean
    cpf?: string
    phone?: string
    unit_id?: string
    created_at: string
    updated_at: string
}

export interface CreateUserInput {
    email: string
    full_name: string
    password: string
    role: UserRole
    cpf?: string
    phone?: string
    unit_id?: string
}

export interface UpdateUserInput {
    email?: string
    full_name?: string
    phone?: string
    unit_id?: string
}
