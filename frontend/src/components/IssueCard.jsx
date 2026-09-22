import { Link } from 'react-router-dom'
import { Clock, Gauge, Wifi, WifiOff } from 'lucide-react'

const DIFFICULTY_COLOR = {
  Easy: 'text-ok border-ok/25 bg-ok/5',
  Medium: 'text-warn border-warn/25 bg-warn/5',
  Hard: 'text-danger border-danger/25 bg-danger/5',
}

export default function IssueCard({ issue }) {
  return (
    <div className="rounded-xl border border-line bg-panel/60 p-5 flex flex-col hover:border-cyan/25 transition-colors">
      <h3 className="font-display text-text font-medium mb-1.5">{issue.title}</h3>
      <p className="text-xs text-text-dim leading-relaxed mb-4 flex-1">{issue.description}</p>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-mono ${DIFFICULTY_COLOR[issue.difficulty] || DIFFICULTY_COLOR.Medium}`}>
          <Gauge size={11} /> {issue.difficulty}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[11px] font-mono text-text-dim">
          <Clock size={11} /> {issue.estimatedTime}
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-mono ${issue.offlineAvailable ? 'border-cyan/25 text-cyan bg-cyan/5' : 'border-line text-text-faint'}`}>
          {issue.offlineAvailable ? <Wifi size={11} /> : <WifiOff size={11} />}
          {issue.offlineAvailable ? 'Offline Available' : 'Online Only'}
        </span>
      </div>

      <Link
        to={`/diagnosis/${issue.id}`}
        className="inline-flex items-center justify-center rounded-lg border border-cyan/30 bg-cyan/10 text-cyan text-xs font-mono uppercase tracking-wider py-2.5 hover:bg-cyan/20 hover:glow-ring transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
      >
        Start Diagnosis
      </Link>
    </div>
  )
}
