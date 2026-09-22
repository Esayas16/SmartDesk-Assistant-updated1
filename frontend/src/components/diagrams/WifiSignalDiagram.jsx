export default function WifiSignalDiagram({ highlight = 0 }) {
  const active = highlight <= 1

  return (
    <svg viewBox="0 0 480 160" className="w-full h-auto" role="img" aria-label="Wi-Fi signal diagram">
      <g transform="translate(240 100)">
        <rect x="-45" y="10" width="90" height="34" rx="6" fill="var(--color-panel-2)" stroke="var(--color-line)" strokeWidth="1.5" />
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M ${-16 - i * 16} 0 A ${16 + i * 16} ${16 + i * 16} 0 0 1 ${16 + i * 16} 0`}
            fill="none"
            stroke={active ? 'var(--color-cyan)' : 'var(--color-line)'}
            strokeWidth="3"
            strokeLinecap="round"
            opacity={active ? 1 - i * 0.22 : 0.4}
            className={active ? 'pulse-ok' : ''}
            transform={`translate(0 ${-8 - i * 4})`}
          />
        ))}
      </g>
      <text x="240" y="150" textAnchor="middle" fill="var(--color-text-dim)" fontSize="11" fontFamily="var(--font-mono)">WI-FI ADAPTER</text>
    </svg>
  )
}
