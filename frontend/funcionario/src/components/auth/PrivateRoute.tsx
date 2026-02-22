import type { ReactNode } from 'react'
import { default as SharedPrivateRoute } from '@shared/components/PrivateRoute'
import { useAuth } from '@/contexts/AuthContext'

const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth()
    return (
        <SharedPrivateRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
            {children}
        </SharedPrivateRoute>
    )
}

export default PrivateRoute
