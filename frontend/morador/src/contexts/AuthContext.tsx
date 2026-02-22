import type { ReactNode } from 'react'
import { AuthProvider as SharedAuthProvider, useAuth } from '@shared/contexts/AuthContext'
import * as authService from '@/services/authService'

export const AuthProvider = ({ children }: { children: ReactNode }) => (
    <SharedAuthProvider authService={authService}>
        {children}
    </SharedAuthProvider>
)

export { useAuth }
