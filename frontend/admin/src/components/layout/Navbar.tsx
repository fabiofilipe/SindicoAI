import { Bell, LogOut, User, Menu } from 'lucide-react'
import { useAuthStore } from '@/store'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavbarProps {
    onMenuClick?: () => void
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
    const { user, logout } = useAuthStore()
    const [showUserMenu, setShowUserMenu] = useState(false)

    const handleLogout = () => {
        logout()
        window.location.href = '/login'
    }

    return (
        <nav className="sticky top-0 z-30 h-16 bg-coal-light/95 backdrop-blur-md border-b border-cyan-glow flex items-center justify-between px-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-cyan hover:text-techblue transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Breadcrumb or Title */}
                <div>
                    <h2 className="text-lg font-semibold text-cyan text-glow-cyan">
                        Dashboard
                    </h2>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 text-metal-silver hover:text-cyan transition-colors rounded-lg hover:bg-cyan/5">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-criticalred rounded-full animate-pulse-glow" />
                </button>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 p-2 pr-3 rounded-lg hover:bg-cyan/5 transition-all group"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-cyber flex items-center justify-center border border-cyan-glow">
                            <User className="w-4 h-4 text-coal" />
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-metal-silver group-hover:text-cyan transition-colors">
                                {user?.full_name || 'Admin'}
                            </p>
                            <p className="text-xs text-metal-silver/60">{user?.role || 'admin'}</p>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {showUserMenu && (
                            <>
                                {/* Overlay */}
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowUserMenu(false)}
                                />

                                {/* Menu */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 top-full mt-2 w-56 bg-coal-light border border-cyan-glow rounded-lg shadow-glow-lg overflow-hidden z-50"
                                >
                                    <div className="p-3 border-b border-cyan-glow/30">
                                        <p className="text-sm font-medium text-metal-silver">
                                            {user?.full_name || 'Admin'}
                                        </p>
                                        <p className="text-xs text-metal-silver/60 truncate">
                                            {user?.email || 'admin@sindicoai.com'}
                                        </p>
                                    </div>

                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                setShowUserMenu(false)
                                                // Navigate to profile
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-metal-silver hover:text-cyan hover:bg-cyan/5 transition-all"
                                        >
                                            <User className="w-4 h-4" />
                                            <span className="text-sm">Meu Perfil</span>
                                        </button>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-criticalred hover:bg-criticalred/10 transition-all"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="text-sm">Sair</span>
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
