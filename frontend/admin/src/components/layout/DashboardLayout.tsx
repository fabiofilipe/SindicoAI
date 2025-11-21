import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useState } from 'react'

const DashboardLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        <div className="flex min-h-screen bg-coal">
            {/* Sidebar */}
            <Sidebar collapsed={sidebarCollapsed} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
                {/* Navbar */}
                <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto bg-tech-grid">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="border-t border-cyan-glow/30 bg-coal-light/50 backdrop-blur-sm">
                    <div className="px-6 py-4 flex items-center justify-between text-sm text-metal-silver/60">
                        <p>© 2025 SindicoAI. Todos os direitos reservados.</p>
                        <p className="hidden md:block">
                            Desenvolvido com{' '}
                            <span className="text-cyan">⚡</span> por Team SindicoAI
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default DashboardLayout
