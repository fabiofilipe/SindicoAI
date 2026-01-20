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
        navigate('/login')
    }

    const isActive = (path: string) => location.pathname === path

    return (
        <div className="min-h-screen bg-marble">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-cream border-r border-border-light z-30">
                {/* Logo */}
                <div className="p-6 border-b border-border-light">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brass rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-cream" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-xl font-display font-semibold text-ink">
                                SindicoAI
                            </h1>
                            <p className="text-xs text-stone">
                                Portal do Morador
                            </p>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.path)

                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                                    transition-all duration-200
                                    ${
                                        active
                                            ? 'bg-brass/10 text-brass border-l-2 border-brass font-medium'
                                            : 'text-graphite hover:bg-parchment hover:text-ink'
                                    }
                                `}
                            >
                                <Icon className="w-5 h-5" strokeWidth={1.5} />
                                <span>{item.label}</span>
                            </button>
                        )
                    })}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border-light">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-graphite hover:bg-burgundy/10 hover:text-burgundy transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" strokeWidth={1.5} />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 min-h-screen">
                <div className="relative z-10 p-8">{children}</div>
            </main>
        </div>
    )
}

export default MainLayout
