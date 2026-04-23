import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage'
import AboutPage from './components/pages/AboutPage'
import BestSellersPage from './components/pages/BestSellersPage'
import CollectionsPage from './components/pages/CollectionsPage'
import ContactPage from './components/pages/ContactPage'
import FaqPage from './components/pages/FaqPage'
import NewArrivalsPage from './components/pages/NewArrivalsPage'
import NotFoundPage from './components/pages/NotFoundPage'
import SalePage from './components/pages/SalePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/new-arrivals" element={<NewArrivalsPage />} />
        <Route path="/best-sellers" element={<BestSellersPage />} />
        <Route path="/sale" element={<SalePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
