import api from './api'

export interface ChangePasswordRequest {
    current_password: string
    new_password: string
}

export const changePassword = async (data: ChangePasswordRequest) => {
    const response = await api.put('/users/me/change-password', data)
    return response.data
}
