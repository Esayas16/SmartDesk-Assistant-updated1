export default function StatCard({ icon: Icon, label, value, subtitle, accent = 'cyan' }) {
  const accentClasses = {
    cyan: 'text-cyan border-cyan/25 bg-cyan/5',
    ok: 'text-ok border-ok/25 bg-ok/5',
    warn: 'text-warn border-warn/25 bg-warn/5',
  }[accent]

  return (
    <div className="rounded-xl border border-line bg-panel/60 p-5 hover:border-cyan/25 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[11px] uppercase tracking-wider text-text-faint">{label}</p>
        {Icon && (
          <div className={`w-8 h-8 rounded-md border flex items-center justify-center ${accentClasses}`}>
            <Icon size={15} />
          </div>
        )}
      </div>
      <p className="font-display text-2xl font-semibold text-text mb-1">{value}</p>
      {subtitle && <p className="text-xs text-text-dim">{subtitle}</p>}
    </div>
  )
}
