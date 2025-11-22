import api from './api'
import type { UserListItem, CreateUserRequest, UpdateUserRequest, ResetPasswordRequest } from '@/types/user'

export const getUsers = async (): Promise<UserListItem[]> => {
    const response = await api.get<UserListItem[]>('/users')
    return response.data
}

export const getUserById = async (userId: string): Promise<UserListItem> => {
    const response = await api.get<UserListItem>(`/users/${userId}`)
    return response.data
}

export const createUser = async (data: CreateUserRequest): Promise<UserListItem> => {
    const response = await api.post<UserListItem>('/users', data)
    return response.data
}

export const updateUser = async (userId: string, data: UpdateUserRequest): Promise<UserListItem> => {
    const response = await api.put<UserListItem>(`/users/${userId}`, data)
    return response.data
}

export const deleteUser = async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}`)
}

export const resetUserPassword = async (userId: string, data: ResetPasswordRequest): Promise<void> => {
    await api.put(`/users/${userId}/reset-password`, data)
}

export const toggleUserStatus = async (userId: string, isActive: boolean): Promise<UserListItem> => {
    const response = await api.put<UserListItem>(`/users/${userId}`, { is_active: isActive })
    return response.data
}
