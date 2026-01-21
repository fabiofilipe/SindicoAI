import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

/**
 * Componente que redireciona para a rota apropriada baseado no estado de autenticação
 * - Se autenticado: vai para /dashboard
 * - Se não autenticado: vai para /login
 * - Durante loading: mostra spinner
 */
const RootRedirect = () => {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-warm">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
}

export default RootRedirect
