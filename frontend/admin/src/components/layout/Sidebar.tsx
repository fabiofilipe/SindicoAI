import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Building2, Bell, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const Sidebar = () => {
    const { logout } = useAuth()

    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/users', icon: Users, label: 'Usuários' },
        { to: '/units', icon: Building2, label: 'Unidades' },
        { to: '/notifications', icon: Bell, label: 'Notificações' },
        { to: '/settings', icon: Settings, label: 'Configurações' },
    ]

    return (
        <aside className="w-64 bg-coal-light border-r border-cyan-glow/20 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-cyan-glow/20">
                <h1 className="text-2xl font-bold text-cyan text-glow-cyan">
                    SindicoAI
                </h1>
                <p className="text-sm text-metal-silver/70 mt-1">Painel Admin</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-lg
                            transition-all duration-300
                            ${isActive
                                ? 'bg-cyan/10 text-cyan border border-cyan/30 shadow-glow-sm'
                                : 'text-metal-silver hover:bg-coal hover:text-cyan'
                            }
                        `}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-cyan-glow/20">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg w-full
                        text-metal-silver hover:bg-coal hover:text-criticalred
                        transition-all duration-300"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sair</span>
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
