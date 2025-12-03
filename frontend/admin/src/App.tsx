import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import PrivateRoute from '@/components/PrivateRoute'
import ErrorBoundary from '@/components/ErrorBoundary'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import UsersPage from '@/pages/UsersPage'
import UnitsPage from '@/pages/UnitsPage'
import CommonAreasPage from '@/pages/CommonAreasPage'
import NotificationsPage from '@/pages/NotificationsPage'
import ReportsPage from '@/pages/ReportsPage'
import SettingsPage from '@/pages/SettingsPage'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
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
            <Route
              path="/units"
              element={
                <PrivateRoute>
                  <UnitsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/common-areas"
              element={
                <PrivateRoute>
                  <CommonAreasPage />
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
              path="/reports"
              element={
                <PrivateRoute>
                  <ReportsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />

            {/* Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
