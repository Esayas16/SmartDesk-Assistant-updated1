import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, LayoutGrid, Search, History, Activity, Bot, Settings,
} from 'lucide-react'
import { useApp } from '../hooks/AppContext'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/categories', label: 'Categories', icon: LayoutGrid },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/history', label: 'History', icon: History },
  { to: '/diagnostics', label: 'Diagnostics', icon: Activity },
  { to: '/ai-assistant', label: 'AI Assistant', icon: Bot },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ onNavigate }) {
  const { online } = useApp()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 h-16 shrink-0 border-b border-line">
        <img
          src={`${import.meta.env.BASE_URL}favicon.svg`}
          alt=""
          width={34}
          height={34}
          className="w-[34px] h-[34px] rounded-lg"
        />
        <div className="leading-tight">
          <p className="font-display font-semibold text-sm tracking-wide text-text">SMARTDESK</p>
          <p className="font-mono text-[10px] tracking-[0.2em] text-text-faint">ASSISTANT</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Primary">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan ${
                isActive
                  ? 'bg-cyan/10 text-cyan border border-cyan/25'
                  : 'text-text-dim border border-transparent hover:text-text hover:bg-panel-hover'
              }`
            }
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-line">
        <p className="font-mono text-[10px] uppercase tracking-wider text-text-faint mb-1.5">System Status</p>
        <div className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider ${online ? 'text-ok' : 'text-danger'}`}>
          <span className={`w-2 h-2 rounded-full ${online ? 'bg-ok pulse-ok' : 'bg-danger pulse-danger'}`} />
          {online ? 'Online' : 'Offline'}
        </div>
      </div>
    </div>
  )
}
