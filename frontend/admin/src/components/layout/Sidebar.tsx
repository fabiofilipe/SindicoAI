import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Building2, Calendar, CalendarDays, Bell, BarChart3, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const Sidebar = () => {
    const { logout } = useAuth()

    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/users', icon: Users, label: 'Usuários' },
        { to: '/units', icon: Building2, label: 'Unidades' },
        { to: '/common-areas', icon: Calendar, label: 'Áreas Comuns' },
        { to: '/events', icon: CalendarDays, label: 'Eventos' },
        { to: '/notifications', icon: Bell, label: 'Notificações' },
        { to: '/reports', icon: BarChart3, label: 'Relatórios' },
        { to: '/settings', icon: Settings, label: 'Configurações' },
    ]

    return (
        <aside className="w-64 bg-cream border-r border-border-light flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-border-light">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brass flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-cream" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-xl font-display font-semibold text-ink">
                            SindicoAI
                        </h1>
                        <p className="text-xs text-stone">Painel Admin</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-lg
                            transition-all duration-200
                            ${isActive
                                ? 'bg-brass/10 text-brass border-l-2 border-brass font-medium'
                                : 'text-graphite hover:bg-parchment hover:text-ink'
                            }
                        `}
                    >
                        <item.icon className="w-5 h-5" strokeWidth={1.5} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-border-light">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg w-full
                        text-graphite hover:bg-burgundy/10 hover:text-burgundy
                        transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" strokeWidth={1.5} />
                    <span>Sair</span>
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
