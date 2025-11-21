import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
    id: string
    email: string
    full_name: string
    role: 'admin' | 'resident' | 'employee'
    tenant_id: string
    is_active: boolean
}

interface AuthState {
    user: User | null
    accessToken: string | null
    refreshToken: string | null
    isAuthenticated: boolean
    isLoading: boolean

    // Actions
    login: (accessToken: string, refreshToken: string, user: User) => void
    logout: () => void
    setUser: (user: User) => void
    setAccessToken: (token: string) => void
    setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,

            login: (accessToken, refreshToken, user) =>
                set({
                    accessToken,
                    refreshToken,
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                }),

            logout: () =>
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                }),

            setUser: (user) => set({ user }),

            setAccessToken: (token) => set({ accessToken: token }),

            setLoading: (loading) => set({ isLoading: loading }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)
