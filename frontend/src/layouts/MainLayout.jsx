import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import ToastNotification from '../components/ToastNotification'

export default function MainLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-void grid-texture">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-line bg-abyss">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-abyss border-r border-line">
            <button
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation menu"
              className="absolute top-4 right-4 text-text-dim hover:text-cyan p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
            >
              <X size={18} />
            </button>
            <Sidebar onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <Header onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <ToastNotification />
    </div>
  )
}
