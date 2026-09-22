// Computer -> Ethernet Cable -> Router/Switch, cable segment highlighted for
// cable-inspection steps.
export default function EthernetDiagram({ highlight = 0 }) {
  const cableOn = highlight === 0 || highlight === 2 || highlight === 4
  const portOn = highlight === 1 || highlight === 2

  return (
    <svg viewBox="0 0 480 160" className="w-full h-auto" role="img" aria-label="Ethernet connection diagram">
      <line x1="95" y1="80" x2="200" y2="80" stroke={cableOn ? 'var(--color-cyan)' : 'var(--color-line)'} strokeWidth={cableOn ? 3 : 2} className={cableOn ? 'diagram-flow' : ''} />
      <line x1="220" y1="80" x2="325" y2="80" stroke={cableOn ? 'var(--color-cyan)' : 'var(--color-line)'} strokeWidth={cableOn ? 3 : 2} className={cableOn ? 'diagram-flow' : ''} />
      <rect x="200" y="72" width="20" height="16" rx="2" fill="var(--color-panel)" stroke="var(--color-line)" />

      <g>
        <rect x="20" y="55" width="75" height="50" rx="8" fill="var(--color-panel-2)" stroke="var(--color-line)" strokeWidth="1.5" />
        <rect x="32" y="66" width="51" height="28" rx="3" fill="var(--color-void)" stroke="var(--color-line)" />
      </g>
      <text x="57" y="122" textAnchor="middle" fill="var(--color-text-dim)" fontSize="11" fontFamily="var(--font-mono)">COMPUTER</text>

      <g>
        <rect x="325" y="58" width="70" height="44" rx="8" fill="var(--color-panel-2)" stroke={portOn ? 'var(--color-cyan)' : 'var(--color-line)'} strokeWidth="1.5" />
        <circle cx="340" cy="80" r={portOn ? 3.5 : 3} fill={portOn ? 'var(--color-ok)' : 'var(--color-text-faint)'} className={portOn ? 'pulse-ok' : ''} />
        <circle cx="355" cy="80" r="3" fill="var(--color-text-faint)" />
        <circle cx="370" cy="80" r="3" fill="var(--color-text-faint)" />
        <circle cx="385" cy="80" r="3" fill="var(--color-text-faint)" />
      </g>
      <text x="360" y="118" textAnchor="middle" fill="var(--color-text-dim)" fontSize="11" fontFamily="var(--font-mono)">ROUTER / SWITCH</text>

      <text x="257" y="60" textAnchor="middle" fill={cableOn ? 'var(--color-cyan)' : 'var(--color-text-faint)'} fontSize="10" fontFamily="var(--font-mono)">CABLE</text>
    </svg>
  )
}
