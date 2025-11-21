import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { DashboardLayout } from '@/components/layout'

// Lazy load pages
import { lazy, Suspense } from 'react'

const LoginPage = lazy(() => import('@/pages/auth').then(m => ({ default: m.LoginPage })))
const DashboardPage = lazy(() => import('@/pages/dashboard').then(m => ({ default: m.DashboardPage })))

// Units pages
const UnitsPage = lazy(() => import('@/pages/units').then(m => ({ default: m.UnitsListPage })))
const UsersPage = lazy(() => import('@/pages/users').then(m => ({ default: m.UsersListPage })))
const CommonAreasPage = lazy(() => Promise.resolve({ default: () => <div className="p-6"><h1 className="text-2xl text-cyan">Áreas Comuns - Em breve</h1></div> }))
const ReservationsPage = lazy(() => Promise.resolve({ default: () => <div className="p-6"><h1 className="text-2xl text-cyan">Reservas - Em breve</h1></div> }))
const DocumentsPage = lazy(() => Promise.resolve({ default: () => <div className="p-6"><h1 className="text-2xl text-cyan">Documentos - Em breve</h1></div> }))
const AIPage = lazy(() => Promise.resolve({ default: () => <div className="p-6"><h1 className="text-2xl text-cyan">Assistente IA - Em breve</h1></div> }))
const NotificationsPage = lazy(() => Promise.resolve({ default: () => <div className="p-6"><h1 className="text-2xl text-cyan">Notificações - Em breve</h1></div> }))
const ImportsPage = lazy(() => Promise.resolve({ default: () => <div className="p-6"><h1 className="text-2xl text-cyan">Importações - Em breve</h1></div> }))
const SettingsPage = lazy(() => Promise.resolve({ default: () => <div className="p-6"><h1 className="text-2xl text-cyan">Configurações - Em breve</h1></div> }))

// Loading component
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen bg-coal">
        <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
            <span className="text-cyan text-glow-cyan">Carregando...</span>
        </div>
    </div>
)

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthStore()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

// Router configuration
export const router = createBrowserRouter([
    {
        path: '/login',
        element: (
            <Suspense fallback={<PageLoader />}>
                <LoginPage />
            </Suspense>
        ),
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path: 'dashboard',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <DashboardPage />
                    </Suspense>
                ),
            },
            {
                path: 'units',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <UnitsPage />
                    </Suspense>
                ),
            },
            {
                path: 'users',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <UsersPage />
                    </Suspense>
                ),
            },
            {
                path: 'common-areas',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <CommonAreasPage />
                    </Suspense>
                ),
            },
            {
                path: 'reservations',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ReservationsPage />
                    </Suspense>
                ),
            },
            {
                path: 'documents',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <DocumentsPage />
                    </Suspense>
                ),
            },
            {
                path: 'ai',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <AIPage />
                    </Suspense>
                ),
            },
            {
                path: 'notifications',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <NotificationsPage />
                    </Suspense>
                ),
            },
            {
                path: 'imports',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <ImportsPage />
                    </Suspense>
                ),
            },
            {
                path: 'settings',
                element: (
                    <Suspense fallback={<PageLoader />}>
                        <SettingsPage />
                    </Suspense>
                ),
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
])
