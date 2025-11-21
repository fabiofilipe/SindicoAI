import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    Home,
    Calendar,
    MessageSquare,
    Bell,
    User,
    LogOut,
    Building2,
} from 'lucide-react'

interface MainLayoutProps {
    children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const navigate = useNavigate()
    const location = useLocation()

    const menuItems = [
        { path: '/home', icon: Home, label: 'Início' },
        { path: '/reservations', icon: Calendar, label: 'Reservas' },
        { path: '/assistant', icon: MessageSquare, label: 'Assistente IA' },
        { path: '/notifications', icon: Bell, label: 'Notificações' },
        { path: '/profile', icon: User, label: 'Perfil' },
    ]

    const handleLogout = () => {
        // TODO: Limpar token de autenticação
        // localStorage.removeItem('token')
        navigate('/login')
    }

    const isActive = (path: string) => location.pathname === path

    return (
        <div className="min-h-screen bg-gradient-to-br from-coal via-coal-light to-coal">
            {/* Background Grid Pattern */}
            <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-coal-light/80 backdrop-blur-md border-r border-cyan-glow/30 z-30">
                {/* Logo */}
                <div className="p-6 border-b border-cyan-glow/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-cyber rounded-lg shadow-glow">
                            <Building2 className="w-6 h-6 text-coal" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-cyan text-glow-cyan">
                                SindicoAI
                            </h1>
                            <p className="text-xs text-metal-silver/60">
                                Portal do Morador
                            </p>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.path)

                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                                    transition-all duration-300
                                    ${
                                        active
                                            ? 'bg-gradient-cyber text-coal font-bold shadow-glow'
                                            : 'text-metal-silver hover:bg-coal hover:text-cyan'
                                    }
                                `}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </button>
                        )
                    })}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cyan-glow/30">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-metal-silver hover:bg-coal hover:text-criticalred transition-all duration-300"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 min-h-screen">
                <div className="relative z-10">{children}</div>
            </main>
        </div>
    )
}

export default MainLayout
