import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ label = 'Loading', size = 18 }) {
  return (
    <span className="inline-flex items-center gap-2 text-text-dim font-mono text-xs uppercase tracking-wider">
      <Loader2 size={size} className="animate-spin text-cyan" />
      {label}
    </span>
  )
}
