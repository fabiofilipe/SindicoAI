import type { ReactNode } from 'react'
import { AuthProvider as SharedAuthProvider, useAuth } from '@shared/contexts/AuthContext'
import * as authService from '@/services/authService'
import type { User } from '@/types/auth'

const validateAdminRole = (user: User): void => {
    if (user.role !== 'admin') {
        authService.logout()
        throw new Error('Acesso negado. Apenas administradores podem acessar este portal.')
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => (
    <SharedAuthProvider authService={authService} validateUser={validateAdminRole}>
        {children}
    </SharedAuthProvider>
)

export { useAuth }
