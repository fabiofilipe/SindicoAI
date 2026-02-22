import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import LoadingSpinner from './ui/LoadingSpinner'

interface PrivateRouteProps {
    children: ReactNode
    isAuthenticated: boolean
    isLoading: boolean
    loginPath?: string
}

const PrivateRoute = ({
    children,
    isAuthenticated,
    isLoading,
    loginPath = '/login',
}: PrivateRouteProps) => {
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return isAuthenticated ? <>{children}</> : <Navigate to={loginPath} replace />
}

export default PrivateRoute
