import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { resolveIcon } from '../utils/iconMap'

export default function CategoryCard({ category, count }) {
  const Icon = resolveIcon(category.icon)

  return (
    <Link
      to={`/categories/${category.id}`}
      className="group relative rounded-xl border border-line bg-panel/60 p-5 hover:border-cyan/30 hover:bg-panel-hover transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg border border-line bg-panel-2 flex items-center justify-center text-cyan group-hover:border-cyan/40 group-hover:glow-ring transition-all">
          <Icon size={18} />
        </div>
        <span className="font-mono text-[11px] text-text-faint">{count} issues</span>
      </div>
      <h3 className="font-display text-text font-medium mb-1.5">{category.name}</h3>
      <p className="text-xs text-text-dim leading-relaxed line-clamp-2">{category.description}</p>
      <div className="mt-4 flex items-center gap-1 text-cyan text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Browse category <ArrowRight size={13} />
      </div>
    </Link>
  )
}
