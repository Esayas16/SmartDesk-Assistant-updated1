import { Wifi, Database, Sparkles, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../hooks/AppContext'
import { categories } from '../data/categories'
import { issues, countByCategory } from '../data/issues'
import StatCard from '../components/StatCard'
import CategoryCard from '../components/CategoryCard'
import StatusBadge from '../components/StatusBadge'

export default function Dashboard() {
  const { online } = useApp()

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-text">SmartDesk Assistant</h2>
          <p className="text-text-dim text-sm mt-1">Offline-first IT diagnostics for your whole organization.</p>
        </div>
        <StatusBadge status={online ? 'online' : 'offline'} label={online ? 'Online' : 'Offline'} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Wifi}
          label="Connectivity"
          value={online ? 'Online' : 'Offline'}
          subtitle={online ? 'AI assistant available' : 'AI assistant unavailable'}
          accent={online ? 'ok' : 'warn'}
        />
        <StatCard icon={Sparkles} label="Known Issues" value={issues.length} subtitle="Across all categories" />
        <StatCard
          icon={Database}
          label="Data Source"
          value={online ? 'Live + Cached' : 'Cached'}
          subtitle="Offline knowledge engine"
        />
      </div>

      <div className="rounded-xl border border-cyan/20 bg-gradient-to-br from-cyan/[0.06] to-transparent p-6 sweep relative overflow-hidden">
        <p className="font-mono text-[11px] uppercase tracking-wider text-cyan mb-2">Quick Access</p>
        <h3 className="font-display text-xl font-semibold text-text mb-1">Start Troubleshooting</h3>
        <p className="text-text-dim text-sm mb-4 max-w-lg">
          Select a category below, or browse all categories for the full list.
        </p>
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 rounded-lg border border-cyan/30 bg-cyan/10 text-cyan text-sm font-medium px-4 py-2.5 hover:bg-cyan/20 hover:glow-ring transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
        >
          Browse all categories <ArrowRight size={15} />
        </Link>
      </div>

      <div>
        <h3 className="font-display text-lg font-semibold text-text mb-4">Troubleshooting Categories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} count={countByCategory(c.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}
