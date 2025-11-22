import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
