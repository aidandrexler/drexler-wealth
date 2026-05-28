import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import StrategyLabPage from './pages/StrategyLabPage'
import InsightsPage from './pages/InsightsPage'
import ArticlePage from './pages/ArticlePage'

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/strategy-lab" element={<StrategyLabPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/insights/:slug" element={<ArticlePage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
