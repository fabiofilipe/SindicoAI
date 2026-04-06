import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_VERSION = '/api/v1'
let accessToken: string | null = null
let refreshPromise: Promise<string | null> | null = null

const api = axios.create({
    baseURL: `${API_BASE_URL}${API_VERSION}`,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
})

export const setAccessToken = (token: string | null): void => {
    accessToken = token
}

export const getAccessTokenValue = (): string | null => accessToken

const refreshAccessToken = async (): Promise<string | null> => {
    if (!refreshPromise) {
        refreshPromise = axios
            .post(
                `${API_BASE_URL}${API_VERSION}/auth/refresh`,
                {},
                { withCredentials: true },
            )
            .then((response: AxiosResponse<{ access_token?: string }>) => {
                const newToken = response.data.access_token ?? null
                setAccessToken(newToken)
                return newToken
            })
            .catch(() => {
                setAccessToken(null)
                return null
            })
            .finally(() => {
                refreshPromise = null
            })
    }

    return refreshPromise
}

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
        return config
    },
    (error: AxiosError) => Promise.reject(error),
)

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError & { config: InternalAxiosRequestConfig & { _retry?: boolean } }) => {
        const originalRequest = error.config
        if (!originalRequest) return Promise.reject(error)

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshedToken = await refreshAccessToken()
                if (!refreshedToken) {
                    window.location.href = '/login'
                    return Promise.reject(error)
                }
                originalRequest.headers.Authorization = `Bearer ${refreshedToken}`

                return api(originalRequest)
            } catch {
                setAccessToken(null)
                window.location.href = '/login'
                return Promise.reject(error)
            }
        }

        return Promise.reject(error)
    },
)

export default api
