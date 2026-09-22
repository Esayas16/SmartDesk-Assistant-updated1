import { useState } from 'react'
import { Wifi, Globe, Router, ShieldCheck, Gauge, Cable, Activity, RefreshCw, FlaskConical } from 'lucide-react'
import { getDiagnosticSnapshot, runPingTest } from '../services/diagnosticsService'
import NetworkDiagnosticCard from '../components/NetworkDiagnosticCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../hooks/useToast'
import { useApp } from '../hooks/AppContext'

export default function Diagnostics() {
  const { online } = useApp()
  const { showToast } = useToast()
  const [snapshot, setSnapshot] = useState(getDiagnosticSnapshot())
  const [running, setRunning] = useState(false)

  const refresh = () => setSnapshot(getDiagnosticSnapshot())

  const runPing = async () => {
    setRunning(true)
    const res = await runPingTest('gateway')
    setRunning(false)
    refresh()
    showToast(
      res.success ? `Ping to gateway succeeded \u2014 ${res.timeMs}ms` : 'Ping to gateway failed \u2014 no route to host',
      res.success ? 'success' : 'error'
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-text">Diagnostics</h2>
          <p className="text-text-dim text-sm mt-1">Live network and device status snapshot.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={runPing}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan/30 bg-cyan/10 text-cyan text-xs font-mono uppercase tracking-wider px-4 py-2.5 hover:bg-cyan/20 disabled:opacity-50 transition-colors"
          >
            {running ? <LoadingSpinner label="Pinging" /> : <><Activity size={14} /> Run Ping Test</>}
          </button>
          <button
            onClick={refresh}
            className="inline-flex items-center gap-2 rounded-lg border border-line text-text-dim text-xs font-mono uppercase tracking-wider px-4 py-2.5 hover:text-text hover:border-text-faint transition-colors"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 rounded-lg border border-warn/25 bg-warn/5 px-3 py-2 text-xs text-warn font-mono uppercase tracking-wider">
        <FlaskConical size={13} /> Demo Data \u2014 simulated for prototype purposes
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <NetworkDiagnosticCard icon={Globe} label="Internet" value={snapshot.internet} />
        <NetworkDiagnosticCard icon={Wifi} label="Wi-Fi" value={snapshot.wifi} />
        <NetworkDiagnosticCard icon={Router} label="IP Address" value={snapshot.ipAddress} />
        <NetworkDiagnosticCard icon={Router} label="Gateway" value={snapshot.gateway} />
        <NetworkDiagnosticCard icon={ShieldCheck} label="DNS" value={snapshot.dns} />
        <NetworkDiagnosticCard icon={Activity} label="Ping" value={snapshot.pingMs} unit={snapshot.pingMs !== null ? 'ms' : ''} />
        <NetworkDiagnosticCard icon={Cable} label="Ethernet" value={snapshot.ethernet} />
        <NetworkDiagnosticCard icon={Gauge} label="Connection Quality" value={snapshot.connectionQuality} />
      </div>

      <div>
        <h3 className="font-display text-lg font-semibold text-text mb-4">Device / Peripheral Status</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {snapshot.devices.map((d) => (
            <div key={d.name} className="rounded-xl border border-line bg-panel/60 p-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-text-faint mb-2">{d.name}</p>
              <p className={`font-display text-sm font-semibold ${d.status === 'OK' ? 'text-ok' : 'text-text-faint'}`}>{d.status}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-text-faint">
        Browser security prevents raw network probing (ARP, ICMP, adapter negotiation). Values above are simulated
        to reflect what a native diagnostic agent would report{online ? '.' : ' while offline.'}
      </p>
    </div>
  )
}
