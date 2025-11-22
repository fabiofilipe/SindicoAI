import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { AuthContextData, User } from '@/types/auth'
import * as authService from '@/services/authService'

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadUser = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const userData = await authService.getCurrentUser()

                    // Verifica se é admin
                    if (userData.role !== 'admin') {
                        authService.logout()
                        throw new Error('Acesso negado. Apenas administradores podem acessar este portal.')
                    }

                    setUser(userData)
                }
            } catch (error) {
                console.error('Erro ao carregar usuário:', error)
                authService.logout()
            } finally {
                setIsLoading(false)
            }
        }

        loadUser()
    }, [])

    const login = async (email: string, password: string): Promise<void> => {
        try {
            await authService.login(email, password)
            const userData = await authService.getCurrentUser()

            // Verifica se é admin
            if (userData.role !== 'admin') {
                authService.logout()
                throw new Error('Acesso negado. Apenas administradores podem acessar este portal.')
            }

            setUser(userData)
        } catch (error) {
            authService.logout()
            setUser(null)
            throw error
        }
    }

    const logout = (): void => {
        authService.logout()
        setUser(null)
    }

    const refreshUser = async (): Promise<void> => {
        try {
            const userData = await authService.getCurrentUser()
            setUser(userData)
        } catch (error) {
            console.error('Erro ao atualizar dados do usuário:', error)
            throw error
        }
    }

    const value: AuthContextData = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider')
    }

    return context
}
