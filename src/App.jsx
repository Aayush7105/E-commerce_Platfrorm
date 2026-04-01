import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage'
import AboutPage from './components/pages/AboutPage'
import CollectionsPage from './components/pages/CollectionsPage'
import ContactPage from './components/pages/ContactPage'
import NewArrivalsPage from './components/pages/NewArrivalsPage'
import NotFoundPage from './components/pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/new-arrivals" element={<NewArrivalsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
