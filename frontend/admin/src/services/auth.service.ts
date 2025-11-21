import api from './api'

export interface LoginCredentials {
    email: string
    password: string
}

export interface LoginResponse {
    access_token: string
    refresh_token: string
    user: {
        id: string
        email: string
        full_name: string
        role: 'admin' | 'resident' | 'employee'
        tenant_id: string
        is_active: boolean
    }
}

export interface RefreshTokenResponse {
    access_token: string
    refresh_token: string
}

export const authService = {
    /**
     * Login user
     * POST /api/v1/auth/login
     */
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login', credentials)
        return response.data
    },

    /**
     * Refresh access token
     * POST /api/v1/auth/refresh
     */
    refresh: async (refreshToken: string): Promise<RefreshTokenResponse> => {
        const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
            refresh_token: refreshToken,
        })
        return response.data
    },

    /**
     * Logout (client-side only, clear tokens)
     */
    logout: () => {
        // Clear tokens from storage
        localStorage.removeItem('auth-storage')
    },
}
