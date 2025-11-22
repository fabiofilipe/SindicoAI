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
