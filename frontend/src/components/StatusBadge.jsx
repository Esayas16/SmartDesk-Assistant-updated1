const VARIANTS = {
  online: { dot: 'bg-ok', text: 'text-ok', pulse: 'pulse-ok' },
  offline: { dot: 'bg-danger', text: 'text-danger', pulse: 'pulse-danger' },
  ok: { dot: 'bg-ok', text: 'text-ok', pulse: 'pulse-ok' },
  warn: { dot: 'bg-warn', text: 'text-warn', pulse: '' },
  danger: { dot: 'bg-danger', text: 'text-danger', pulse: 'pulse-danger' },
  neutral: { dot: 'bg-text-faint', text: 'text-text-dim', pulse: '' },
}

export default function StatusBadge({ status = 'online', label, size = 'md' }) {
  const v = VARIANTS[status] || VARIANTS.neutral
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
  const textSize = size === 'sm' ? 'text-[11px]' : 'text-xs'

  return (
    <span className={`inline-flex items-center gap-2 font-mono uppercase tracking-wider ${textSize} ${v.text}`}>
      <span className={`rounded-full ${dotSize} ${v.dot} ${v.pulse}`} />
      {label}
    </span>
  )
}
