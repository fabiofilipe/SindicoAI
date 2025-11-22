export interface TokenResponse {
    access_token: string
    refresh_token: string
    token_type: string
}

export interface User {
    id: string
    email: string
    cpf?: string
    full_name?: string
    role: 'admin' | 'resident' | 'staff'
    is_active: boolean
    tenant_id: string
    unit_id?: string
}

export interface AuthContextData {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    refreshUser: () => Promise<void>
}
