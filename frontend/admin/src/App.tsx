import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import PrivateRoute from '@/components/PrivateRoute'
import RootRedirect from '@/components/RootRedirect'
import ErrorBoundary from '@/components/ErrorBoundary'
import LoginPage from '@/pages/LoginPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import DashboardPage from '@/pages/DashboardPage'
import UsersPage from '@/pages/UsersPage'
import UnitsPage from '@/pages/UnitsPage'
import CommonAreasPage from '@/pages/CommonAreasPage'
import EventsPage from '@/pages/EventsPage'
import NotificationsPage from '@/pages/NotificationsPage'
import ReportsPage from '@/pages/ReportsPage'
import SettingsPage from '@/pages/SettingsPage'
import AuditLogsPage from '@/pages/AuditLogsPage'

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
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

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
              path="/events"
              element={
                <PrivateRoute>
                  <EventsPage />
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
            <Route
              path="/audit-logs"
              element={
                <PrivateRoute>
                  <AuditLogsPage />
                </PrivateRoute>
              }
            />

            {/* Redirect - verifica autenticação antes */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
