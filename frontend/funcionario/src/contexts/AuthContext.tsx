import type { ReactNode } from 'react'
import { AuthProvider as SharedAuthProvider, useAuth } from '@shared/contexts/AuthContext'
import * as authService from '@/services/authService'
import type { User } from '@/types/auth'

const validateStaffRole = (user: User): void => {
    if (user.role !== 'staff' && user.role !== 'admin') {
        authService.logout()
        throw new Error('Acesso negado. Apenas funcionários podem acessar este portal.')
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => (
    <SharedAuthProvider authService={authService} validateUser={validateStaffRole}>
        {children}
    </SharedAuthProvider>
)

export { useAuth }
