import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import { useAuth } from '@/contexts/AuthContext'

interface MainLayoutProps {
    children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const { user } = useAuth()

    return (
        <div className="min-h-screen bg-marble flex">
            <Sidebar />

            <main className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-cream border-b border-border-light px-8 py-4">
                    <div className="flex items-center justify-end">
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-ink">
                                    {user?.full_name || user?.email}
                                </p>
                                <p className="text-xs text-stone">Administrador</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-brass flex items-center justify-center text-cream font-semibold">
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
