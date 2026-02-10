import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts'
import { PrivateRoute } from '@/components'
import ErrorBoundary from '@/components/ErrorBoundary'
import { LoginPage, ForgotPasswordPage, ResetPasswordPage, HomePage, ReservationsPage, AssistantPage, NotificationsPage, ProfilePage } from '@/pages'
import EventsPage from '@/pages/events/EventsPage'

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#0a0e27',
                            color: '#00f0ff',
                            border: '1px solid #00f0ff',
                            fontFamily: 'monospace',
                        },
                        success: {
                            iconTheme: {
                                primary: '#00f0ff',
                                secondary: '#0a0e27',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ff0055',
                                secondary: '#0a0e27',
                            },
                        },
                    }}
                />
                <BrowserRouter>
                    <Routes>
                        {/* Rota padrão redireciona para login */}
                        <Route path="/" element={<Navigate to="/login" replace />} />

                        {/* Autenticação */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />

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
                            path="/events"
                            element={
                                <PrivateRoute>
                                    <EventsPage />
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
        </ErrorBoundary>
    )
}

export default App
