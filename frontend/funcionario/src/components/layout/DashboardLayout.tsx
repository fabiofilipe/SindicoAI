import { type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Calendar, Bell, User, LogOut, Building2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface DashboardLayoutProps {
    children: ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuth()

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Calendar, label: 'Agenda', path: '/schedule' },
        { icon: Bell, label: 'Notificações', path: '/notifications' },
        { icon: User, label: 'Perfil', path: '/profile' },
    ]

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-marble pb-20">
            {/* Top Bar */}
            <div className="bg-cream border-b border-border-light px-6 py-4 sticky top-0 z-20">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brass rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-cream" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-semibold text-ink">SindicoAI</h2>
                            <p className="text-xs text-stone">Portal Funcionário</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-ink">{user?.full_name}</p>
                        <p className="text-xs text-stone">
                            {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6">
                {children}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-cream border-t border-border-light z-20">
                <div className="flex items-center justify-around max-w-7xl mx-auto py-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        const Icon = item.icon
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`flex flex-col items-center px-4 py-2 transition-all rounded-lg ${
                                    isActive
                                        ? 'text-brass'
                                        : 'text-stone hover:text-brass hover:bg-parchment'
                                }`}
                            >
                                <Icon size={24} strokeWidth={1.5} />
                                <span className="text-xs mt-1 font-medium">{item.label}</span>
                            </button>
                        )
                    })}
                    <button
                        onClick={handleLogout}
                        className="flex flex-col items-center px-4 py-2 text-stone hover:text-burgundy hover:bg-burgundy/10 transition-all rounded-lg"
                    >
                        <LogOut size={24} strokeWidth={1.5} />
                        <span className="text-xs mt-1 font-medium">Sair</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout
