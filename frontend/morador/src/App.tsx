import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage, HomePage, ReservationsPage, AssistantPage, NotificationsPage, ProfilePage } from '@/pages'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rota padrão redireciona para login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Autenticação */}
                <Route path="/login" element={<LoginPage />} />

                {/* Rotas protegidas */}
                <Route path="/home" element={<HomePage />} />
                <Route path="/reservations" element={<ReservationsPage />} />
                <Route path="/assistant" element={<AssistantPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* 404 - Rota não encontrada */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
