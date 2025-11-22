import { type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Calendar, Bell, User, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface DashboardLayoutProps {
    children: ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuth()

    const navItems = [
        { icon: <LayoutDashboard size={28} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <Calendar size={28} />, label: 'Agenda', path: '/schedule' },
        { icon: <Bell size={28} />, label: 'Notificações', path: '/notifications' },
        { icon: <User size={28} />, label: 'Perfil', path: '/profile' },
    ]

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-coal grid-pattern">
            {/* Top Bar */}
            <div className="bg-charcoal border-b-2 border-neon-cyan/20 px-6 py-4">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div>
                        <h2 className="text-2xl font-bold text-neon-cyan">SINDICO AI</h2>
                        <p className="text-sm text-metal-silver">Funcionário</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-semibold text-white">{user?.full_name}</p>
                        <p className="text-sm text-metal-silver">
                            {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto">
                {children}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-charcoal border-t-2 border-neon-cyan/20">
                <div className="flex items-center justify-around max-w-7xl mx-auto py-3">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`flex flex-col items-center px-4 py-2 transition-all ${isActive
                                    ? 'text-neon-cyan'
                                    : 'text-metal-silver hover:text-neon-cyan'
                                    }`}
                            >
                                {item.icon}
                                <span className="text-xs mt-1 font-semibold">{item.label}</span>
                            </button>
                        )
                    })}
                    <button
                        onClick={handleLogout}
                        className="flex flex-col items-center px-4 py-2 text-critical-red hover:text-critical-red/80 transition-all"
                    >
                        <LogOut size={28} />
                        <span className="text-xs mt-1 font-semibold">Sair</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout
