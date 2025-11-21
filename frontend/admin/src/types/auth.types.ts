export interface User {
    id: string
    email: string
    full_name: string
    role: 'admin' | 'resident' | 'employee'
    tenant_id: string
    is_active: boolean
}

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    access_token: string
    refresh_token: string
    user: User
}

export interface RefreshTokenRequest {
    refresh_token: string
}

export interface RefreshTokenResponse {
    access_token: string
    refresh_token: string
}
