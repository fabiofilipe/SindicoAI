import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import { useAuth } from '@/contexts/AuthContext'

interface MainLayoutProps {
    children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const { user } = useAuth()

    return (
        <div className="min-h-screen bg-coal flex">
            <Sidebar />

            <main className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-coal-light border-b border-cyan-glow/20 px-8 py-4">
                    <div className="flex items-center justify-end">
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-cyan">
                                    {user?.full_name || user?.email}
                                </p>
                                <p className="text-xs text-metal-silver/70">Administrador</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-cyber flex items-center justify-center text-coal font-bold">
                                {(user?.full_name?.[0] || user?.email[0] || 'A').toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 p-8 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default MainLayout
