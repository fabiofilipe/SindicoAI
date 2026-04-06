import api from './api'
import { getAccessTokenValue, setAccessToken } from './api'
import type { TokenResponse, User } from '../types/auth'

export const login = async (email: string, password: string): Promise<TokenResponse> => {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)

    const response = await api.post<TokenResponse>('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })

    setAccessToken(response.data.access_token)

    return response.data
}

export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get<User>('/users/me')
    return response.data
}

export const logout = (): void => {
    const currentToken = getAccessTokenValue()
    setAccessToken(null)
    void fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: currentToken ? { Authorization: `Bearer ${currentToken}` } : undefined,
    })
}

export const isAuthenticated = (): boolean => {
    return !!getAccessTokenValue()
}

export const getAccessToken = (): string | null => {
    return getAccessTokenValue()
}

export const getRefreshToken = (): string | null => {
    return null
}
