import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// Create axios instance
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor - Add auth token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const { accessToken } = useAuthStore.getState()

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

// Response interceptor - Handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // If 401 and not already retried, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const { refreshToken } = useAuthStore.getState()

                if (!refreshToken) {
                    throw new Error('No refresh token available')
                }

                // Call refresh endpoint
                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refresh_token: refreshToken,
                })

                const { access_token, refresh_token: newRefreshToken } = response.data

                // Update tokens in store  
                const currentUser = useAuthStore.getState().user
                if (currentUser) {
                    useAuthStore.getState().login(access_token, newRefreshToken, currentUser)
                }

                // Update authorization header
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${access_token}`
                }

                // Retry original request
                return api(originalRequest)
            } catch (refreshError) {
                // Refresh failed, logout user
                useAuthStore.getState().logout()
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default api
