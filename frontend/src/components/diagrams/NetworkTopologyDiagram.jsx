// Computer -> Router -> Internet, with the relevant hop highlighted per step.
export default function NetworkTopologyDiagram({ highlight = 0 }) {
  const segColor = (i) => (highlight === i ? 'var(--color-cyan)' : 'var(--color-line)')
  const nodeGlow = (i) => (highlight === i ? 'glow-ring' : '')

  return (
    <svg viewBox="0 0 480 160" className="w-full h-auto" role="img" aria-label="Network topology diagram">
      <line x1="90" y1="80" x2="230" y2="80" stroke={segColor(1)} strokeWidth="2" className={highlight === 1 ? 'diagram-flow' : ''} />
      <line x1="250" y1="80" x2="390" y2="80" stroke={segColor(3)} strokeWidth="2" className={highlight === 3 || highlight === 4 ? 'diagram-flow' : ''} />

      {/* Computer */}
      <g className={nodeGlow(0)}>
        <rect x="20" y="55" width="70" height="50" rx="8" fill="var(--color-panel-2)" stroke={highlight === 0 || highlight === 2 ? 'var(--color-cyan)' : 'var(--color-line)'} strokeWidth="1.5" />
        <rect x="32" y="66" width="46" height="28" rx="3" fill="var(--color-void)" stroke="var(--color-line)" />
      </g>
      <text x="55" y="122" textAnchor="middle" fill="var(--color-text-dim)" fontSize="11" fontFamily="var(--font-mono)">COMPUTER</text>

      {/* Router */}
      <g className={nodeGlow(1)}>
        <rect x="230" y="60" width="60" height="40" rx="8" fill="var(--color-panel-2)" stroke={highlight === 1 ? 'var(--color-cyan)' : 'var(--color-line)'} strokeWidth="1.5" />
        <circle cx="245" cy="80" r="3" fill={highlight === 1 ? 'var(--color-cyan)' : 'var(--color-text-faint)'} />
        <circle cx="260" cy="80" r="3" fill={highlight === 1 ? 'var(--color-cyan)' : 'var(--color-text-faint)'} />
        <circle cx="275" cy="80" r="3" fill={highlight === 1 ? 'var(--color-cyan)' : 'var(--color-text-faint)'} />
      </g>
      <text x="260" y="118" textAnchor="middle" fill="var(--color-text-dim)" fontSize="11" fontFamily="var(--font-mono)">ROUTER</text>

      {/* Internet cloud */}
      <g className={nodeGlow(3)}>
        <ellipse cx="425" cy="80" rx="45" ry="28" fill="var(--color-panel-2)" stroke={highlight === 3 || highlight === 4 ? 'var(--color-cyan)' : 'var(--color-line)'} strokeWidth="1.5" />
      </g>
      <text x="425" y="118" textAnchor="middle" fill="var(--color-text-dim)" fontSize="11" fontFamily="var(--font-mono)">INTERNET</text>
    </svg>
  )
}
