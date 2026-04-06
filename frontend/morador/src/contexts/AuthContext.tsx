import type { ReactNode } from 'react'
import { AuthProvider as SharedAuthProvider, useAuth } from '@shared/contexts/AuthContext'
import * as authService from '@/services/authService'
import type { User } from '@/types/auth'

const validateResidentRole = (user: User): void => {
    if (user.role !== 'resident') {
        authService.logout()
        throw new Error('Acesso negado. Apenas moradores podem acessar este portal.')
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => (
    <SharedAuthProvider authService={authService} validateUser={validateResidentRole}>
        {children}
    </SharedAuthProvider>
)

export { useAuth }
