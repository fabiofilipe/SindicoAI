import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts'

interface PrivateRouteProps {
    children: ReactNode
}

/**
 * Componente que protege rotas privadas
 * Redireciona para login se usuário não estiver autenticado
 */
const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth()

    // Mostra loading enquanto verifica autenticação
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coal via-coal-light to-coal">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-cyan text-lg">Carregando...</p>
                </div>
            </div>
        )
    }

    // Se não estiver autenticado, redireciona para login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // Se autenticado, renderiza o conteúdo
    return <>{children}</>
}

export default PrivateRoute
