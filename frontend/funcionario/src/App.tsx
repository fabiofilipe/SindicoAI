import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/auth/PrivateRoute'
import DashboardLayout from './components/layout/DashboardLayout'

// Pages
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/home/DashboardPage'
import SchedulePage from './pages/schedule/SchedulePage'
import ReservationDetailsPage from './pages/schedule/ReservationDetailsPage'
import NotificationsPage from './pages/notifications/NotificationsPage'
import ProfilePage from './pages/profile/ProfilePage'

function App() {
  return (
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
          <Route path="/login" element={<LoginPage />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </PrivateRoute>
          } />

          <Route path="/schedule" element={
            <PrivateRoute>
              <DashboardLayout>
                <SchedulePage />
              </DashboardLayout>
            </PrivateRoute>
          } />

          <Route path="/reservations/:id" element={
            <PrivateRoute>
              <DashboardLayout>
                <ReservationDetailsPage />
              </DashboardLayout>
            </PrivateRoute>
          } />

          <Route path="/notifications" element={
            <PrivateRoute>
              <DashboardLayout>
                <NotificationsPage />
              </DashboardLayout>
            </PrivateRoute>
          } />

          <Route path="/profile" element={
            <PrivateRoute>
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </PrivateRoute>
          } />

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
