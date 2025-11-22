import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface PrivateRouteProps {
    children: React.ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-coal">
                <Loader2 className="w-12 h-12 text-cyan animate-spin" />
            </div>
        )
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default PrivateRoute
