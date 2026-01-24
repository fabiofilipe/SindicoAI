import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import StorytellingLandingPage from '@/pages/NewLandingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StorytellingLandingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
