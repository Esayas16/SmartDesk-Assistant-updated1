export default function ProgressIndicator({ current, total }) {
  const pct = Math.round((current / total) * 100)

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-cyan">
          Step {current} of {total}
        </span>
        <span className="font-mono text-[11px] text-text-faint">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-panel-2 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full bg-gradient-to-r from-cyan-dim to-cyan rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
