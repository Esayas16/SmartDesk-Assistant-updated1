const STATUS_COLOR = {
  CONNECTED: 'text-ok', AVAILABLE: 'text-ok', GOOD: 'text-ok',
  DISCONNECTED: 'text-danger', UNREACHABLE: 'text-danger', NONE: 'text-danger', 'No link': 'text-danger',
}

export default function NetworkDiagnosticCard({ icon: Icon, label, value, unit }) {
  const color = STATUS_COLOR[value] || 'text-text'

  return (
    <div className="rounded-xl border border-line bg-panel/60 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-text-faint">{label}</p>
        {Icon && <Icon size={15} className="text-text-faint" />}
      </div>
      <p className={`font-display text-xl font-semibold ${color}`}>
        {value === null || value === undefined ? '\u2014' : value}
        {unit && <span className="text-sm text-text-dim ml-1">{unit}</span>}
      </p>
    </div>
  )
}
