import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts'
import { PrivateRoute } from '@/components'
import { LoginPage, HomePage, ReservationsPage, AssistantPage, NotificationsPage, ProfilePage } from '@/pages'

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Rota padrão redireciona para login */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* Autenticação */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Rotas protegidas */}
                    <Route
                        path="/home"
                        element={
                            <PrivateRoute>
                                <HomePage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/reservations"
                        element={
                            <PrivateRoute>
                                <ReservationsPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/assistant"
                        element={
                            <PrivateRoute>
                                <AssistantPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/notifications"
                        element={
                            <PrivateRoute>
                                <NotificationsPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <ProfilePage />
                            </PrivateRoute>
                        }
                    />

                    {/* 404 - Rota não encontrada */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
