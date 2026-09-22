import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react'
import { useToast } from '../hooks/useToast'

const ICONS = {
  success: { Icon: CheckCircle2, color: 'text-ok', border: 'border-ok/30' },
  warning: { Icon: AlertTriangle, color: 'text-warn', border: 'border-warn/30' },
  error: { Icon: XCircle, color: 'text-danger', border: 'border-danger/30' },
  info: { Icon: Info, color: 'text-cyan', border: 'border-cyan/30' },
}

export default function ToastNotification() {
  const { toasts, dismissToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))]" role="status" aria-live="polite">
      {toasts.map((t) => {
        const cfg = ICONS[t.type] || ICONS.info
        const { Icon } = cfg
        return (
          <div
            key={t.id}
            className={`flex items-start gap-3 bg-panel border ${cfg.border} rounded-lg px-4 py-3 shadow-lg glow-ring`}
          >
            <Icon size={16} className={`${cfg.color} mt-0.5 shrink-0`} />
            <p className="text-sm text-text flex-1">{t.message}</p>
            <button
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss notification"
              className="text-text-faint hover:text-text transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
