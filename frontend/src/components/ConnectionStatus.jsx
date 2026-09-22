import { Cloud, CloudOff } from 'lucide-react'

export default function ConnectionStatus({ online, compact = false }) {
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider ${online ? 'text-ok' : 'text-danger'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-ok pulse-ok' : 'bg-danger pulse-danger'}`} />
        {online ? 'Online' : 'Offline'}
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${online ? 'border-ok/25 bg-ok/5' : 'border-danger/25 bg-danger/5'}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${online ? 'border-ok/30 text-ok' : 'border-danger/30 text-danger'}`}>
        {online ? <Cloud size={16} /> : <CloudOff size={16} />}
      </div>
      <div>
        <p className={`font-mono text-xs uppercase tracking-wider ${online ? 'text-ok' : 'text-danger'}`}>
          {online ? 'Online \u00b7 AI Cloud Available' : 'Offline \u00b7 Using Local Knowledge Engine'}
        </p>
        <p className="text-text-faint text-xs mt-0.5">
          {online ? 'Complex questions are routed to cloud AI when needed.' : 'Cloud AI is disabled. Answering from cached rules only.'}
        </p>
      </div>
    </div>
  )
}
