import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-line rounded-xl bg-panel/40">
      <div className="w-12 h-12 rounded-full bg-panel-2 border border-line flex items-center justify-center mb-4">
        <Icon size={20} className="text-text-faint" />
      </div>
      <h3 className="font-display text-text text-sm font-medium mb-1">{title}</h3>
      {description && <p className="text-text-dim text-sm max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
