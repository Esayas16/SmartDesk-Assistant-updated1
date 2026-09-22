import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Categories from './pages/Categories'
import CategoryDetail from './pages/CategoryDetail'
import DiagnosisWorkflow from './pages/DiagnosisWorkflow'
import Search from './pages/Search'
import AIAssistant from './pages/AIAssistant'
import Diagnostics from './pages/Diagnostics'
import History from './pages/History'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:categoryId" element={<CategoryDetail />} />
        <Route path="/diagnosis/:issueId" element={<DiagnosisWorkflow />} />
        <Route path="/search" element={<Search />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/diagnostics" element={<Diagnostics />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
