import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    Building2,
    Users,
    MapPin,
    Calendar,
    FileText,
    Bot,
    Bell,
    Upload,
    Settings,
    Menu,
    X
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
    collapsed?: boolean
}

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Building2, label: 'Unidades', path: '/units' },
    { icon: Users, label: 'Usuários', path: '/users' },
    { icon: MapPin, label: 'Áreas Comuns', path: '/common-areas' },
    { icon: Calendar, label: 'Reservas', path: '/reservations' },
    { icon: FileText, label: 'Documentos', path: '/documents' },
    { icon: Bot, label: 'Assistente IA', path: '/ai' },
    { icon: Bell, label: 'Notificações', path: '/notifications' },
    { icon: Upload, label: 'Importações', path: '/imports' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
]

const Sidebar = ({ collapsed: controlledCollapsed }: SidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(controlledCollapsed ?? false)

    const toggleSidebar = () => setIsCollapsed(!isCollapsed)

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-coal/80 backdrop-blur-sm z-40 lg:hidden"
                        onClick={toggleSidebar}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isCollapsed ? '0px' : '280px',
                    x: isCollapsed ? '-280px' : '0px',
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="fixed lg:sticky top-0 left-0 h-screen bg-gradient-industrial border-r border-cyan-glow z-50 flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-cyan-glow flex items-center justify-between">
                    <motion.div
                        initial={false}
                        animate={{ opacity: isCollapsed ? 0 : 1 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-lg bg-gradient-cyber flex items-center justify-center">
                            <Bot className="w-6 h-6 text-coal" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-cyan text-glow-cyan">SindicoAI</h1>
                            <p className="text-xs text-metal-silver">Admin Panel</p>
                        </div>
                    </motion.div>

                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-cyan hover:text-techblue transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto scrollbar-thin py-6 px-3">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                                            isActive
                                                ? 'bg-cyan/10 text-cyan border border-cyan-glow shadow-glow'
                                                : 'text-metal-silver hover:text-cyan hover:bg-cyan/5'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <item.icon
                                                className={`w-5 h-5 ${isActive ? 'text-cyan' : 'group-hover:text-cyan'}`}
                                            />
                                            <span className="font-medium">{item.label}</span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-nav"
                                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan shadow-glow-sm"
                                                />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-cyan-glow">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-coal-light/50 border border-cyan-glow/30">
                        <div className="w-8 h-8 rounded-full bg-gradient-cyber flex items-center justify-center">
                            <span className="text-coal font-bold text-sm">A</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-metal-silver truncate">Admin</p>
                            <p className="text-xs text-metal-silver/60 truncate">admin@sindicoai.com</p>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Mobile Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="fixed bottom-6 right-6 lg:hidden z-30 w-14 h-14 rounded-full bg-gradient-cyber shadow-glow-lg flex items-center justify-center"
            >
                <Menu className="w-6 h-6 text-coal" />
            </button>
        </>
    )
}

export default Sidebar
