export default function DisplayDiagram({ highlight = 0 }) {
  const cableOn = highlight === 0

  return (
    <svg viewBox="0 0 480 160" className="w-full h-auto" role="img" aria-label="Display connection diagram">
      <line x1="130" y1="80" x2="270" y2="80" stroke={cableOn ? 'var(--color-cyan)' : 'var(--color-line)'} strokeWidth={cableOn ? 3 : 2} className={cableOn ? 'diagram-flow' : ''} />

      <g>
        <rect x="30" y="55" width="90" height="55" rx="4" fill="var(--color-panel-2)" stroke="var(--color-line)" strokeWidth="1.5" />
        <rect x="38" y="62" width="74" height="34" rx="2" fill="var(--color-void)" stroke="var(--color-line)" />
        <rect x="60" y="112" width="30" height="6" fill="var(--color-line)" />
      </g>
      <text x="75" y="135" textAnchor="middle" fill="var(--color-text-dim)" fontSize="11" fontFamily="var(--font-mono)">COMPUTER</text>

      <g>
        <rect x="270" y="45" width="180" height="70" rx="4" fill="var(--color-panel-2)" stroke={highlight === 1 ? 'var(--color-cyan)' : 'var(--color-line)'} strokeWidth="1.5" />
        <rect x="280" y="53" width="160" height="54" rx="2" fill="var(--color-void)" stroke="var(--color-line)" />
        {highlight === 1 && (
          <text x="360" y="82" textAnchor="middle" fill="var(--color-cyan)" fontSize="10" fontFamily="var(--font-mono)">NO SIGNAL</text>
        )}
        <rect x="345" y="115" width="30" height="8" fill="var(--color-line)" />
      </g>
      <text x="360" y="140" textAnchor="middle" fill="var(--color-text-dim)" fontSize="11" fontFamily="var(--font-mono)">MONITOR</text>
    </svg>
  )
}
