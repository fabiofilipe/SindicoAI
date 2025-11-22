import api from './api'
import type { TokenResponse, User } from '@/types/auth'

export const login = async (email: string, password: string): Promise<TokenResponse> => {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)

    const response = await api.post<TokenResponse>('/auth/login', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })

    localStorage.setItem('access_token', response.data.access_token)
    localStorage.setItem('refresh_token', response.data.refresh_token)

    return response.data
}

export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get<User>('/users/me')
    return response.data
}

export const logout = (): void => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
}

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('access_token')
}
