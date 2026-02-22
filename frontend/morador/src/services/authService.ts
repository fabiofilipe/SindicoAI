export { login, getCurrentUser, logout, isAuthenticated, getAccessToken, getRefreshToken } from '@shared/services/authService'
import api from './api'
import type { User } from '@/types/auth'

export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/users/${userId}`, data)
    return response.data
}

export const changePassword = async (data: {
    current_password: string
    new_password: string
}): Promise<User> => {
    const response = await api.put<User>('/users/me/change-password', data)
    return response.data
}
