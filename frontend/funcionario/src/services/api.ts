import axios from 'axios'

// Base URL da API - pode ser configurada via variável de ambiente
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_VERSION = '/api/v1'

// Criar instância do axios
const api = axios.create({
    baseURL: `${API_BASE_URL}${API_VERSION}`,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Interceptor de requisição - adiciona token de autenticação
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Interceptor de resposta - trata erros e refresh de token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Se erro 401 e não é retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem('refresh_token')

                if (!refreshToken) {
                    // Sem refresh token, redireciona para login
                    localStorage.clear()
                    window.location.href = '/login'
                    return Promise.reject(error)
                }

                // Tentar renovar o token
                const response = await axios.post(
                    `${API_BASE_URL}${API_VERSION}/auth/refresh`,
                    { refresh_token: refreshToken }
                )

                const { access_token, refresh_token: new_refresh_token } = response.data

                // Salvar novos tokens
                localStorage.setItem('access_token', access_token)
                localStorage.setItem('refresh_token', new_refresh_token)

                // Atualizar header da requisição original
                originalRequest.headers.Authorization = `Bearer ${access_token}`

                // Tentar novamente a requisição original
                return api(originalRequest)
            } catch (refreshError) {
                // Erro ao renovar token, redireciona para login
                localStorage.clear()
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default api
