import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import PrivateRoute from '@/components/PrivateRoute'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import UsersPage from '@/pages/UsersPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Private routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <UsersPage />
              </PrivateRoute>
            }
          />

          {/* Placeholder routes */}
          <Route
            path="/units"
            element={
              <PrivateRoute>
                <div className="min-h-screen bg-coal flex items-center justify-center">
                  <p className="text-metal-silver text-lg">Página de Unidades em desenvolvimento</p>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <div className="min-h-screen bg-coal flex items-center justify-center">
                  <p className="text-metal-silver text-lg">Página de Notificações em desenvolvimento</p>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <div className="min-h-screen bg-coal flex items-center justify-center">
                  <p className="text-metal-silver text-lg">Página de Configurações em desenvolvimento</p>
                </div>
              </PrivateRoute>
            }
          />

          {/* Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
