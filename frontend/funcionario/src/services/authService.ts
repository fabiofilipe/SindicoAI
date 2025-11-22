import api from './api'
import type { TokenResponse, User } from '@/types/auth'

/**
 * Serviço de Autenticação
 * Gerencia login, logout e informações do usuário
 */

/**
 * Realiza login do usuário
 * @param email - Email do usuário
 * @param password - Senha do usuário
 * @returns Promise com os tokens de autenticação
 */
export const login = async (email: string, password: string): Promise<TokenResponse> => {
    // O backend espera OAuth2PasswordRequestForm
    // que usa form-data com username e password
    const formData = new FormData()
    formData.append('username', email) // OAuth2 usa 'username' mas enviamos email
    formData.append('password', password)

    const response = await api.post<TokenResponse>('/auth/login', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })

    // Salvar tokens no localStorage
    localStorage.setItem('access_token', response.data.access_token)
    localStorage.setItem('refresh_token', response.data.refresh_token)

    return response.data
}

/**
 * Busca informações do usuário atual
 * @returns Promise com os dados do usuário
 */
export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get<User>('/users/me')
    return response.data
}

/**
 * Atualiza dados do perfil do usuário
 * @param userId - ID do usuário
 * @param data - Dados a serem atualizados
 * @returns Promise com os dados atualizados
 */
export const updateUserProfile = async (
    userId: string,
    data: Partial<User>
): Promise<User> => {
    const response = await api.put<User>(`/users/${userId}`, data)
    return response.data
}

/**
 * Realiza logout do usuário
 * Remove tokens do localStorage
 */
export const logout = (): void => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
}

/**
 * Verifica se o usuário está autenticado
 * @returns true se existir access_token no localStorage
 */
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('access_token')
}

/**
 * Obtém o token de acesso do localStorage
 * @returns Token de acesso ou null
 */
export const getAccessToken = (): string | null => {
    return localStorage.getItem('access_token')
}

/**
 * Obtém o refresh token do localStorage
 * @returns Refresh token ou null
 */
export const getRefreshToken = (): string | null => {
    return localStorage.getItem('refresh_token')
}
