import { Menu } from 'lucide-react'
import { useApp } from '../hooks/AppContext'
import ConnectionStatus from './ConnectionStatus'

export default function Header({ onMenuClick }) {
  const { online } = useApp()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-6 h-16 border-b border-line bg-void/90 backdrop-blur-md">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-text-dim hover:text-cyan transition-colors p-1.5 -ml-1.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-display text-base sm:text-lg font-semibold text-text truncate">SmartDesk Assistant</h1>
      </div>
      <ConnectionStatus online={online} compact />
    </header>
  )
}
