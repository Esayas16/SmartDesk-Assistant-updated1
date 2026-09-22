import { Eye, Trash2, CheckCircle2, ArrowUpRight } from 'lucide-react'
import { formatDuration } from '../services/historyService'

export default function HistoryTable({ entries, onView, onDelete }) {
  if (entries.length === 0) return null

  return (
    <div className="rounded-xl border border-line bg-panel/60 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              {['Date', 'Issue', 'Category', 'Result', 'Duration', 'Mode', ''].map((h) => (
                <th key={h} className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-text-faint whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-line-soft last:border-0 hover:bg-panel-hover transition-colors">
                <td className="px-4 py-3 text-text-dim whitespace-nowrap">
                  {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-4 py-3 text-text font-medium whitespace-nowrap">{entry.issueTitle}</td>
                <td className="px-4 py-3 text-text-dim whitespace-nowrap">{entry.category}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider ${entry.result === 'Resolved' ? 'text-ok' : 'text-warn'}`}>
                    {entry.result === 'Resolved' ? <CheckCircle2 size={12} /> : <ArrowUpRight size={12} />}
                    {entry.result}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-dim font-mono whitespace-nowrap">{formatDuration(entry.durationSec)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`font-mono text-[11px] uppercase tracking-wider ${entry.mode === 'Offline' ? 'text-cyan' : 'text-text-dim'}`}>
                    {entry.mode}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(entry)}
                      aria-label={`View diagnosis for ${entry.issueTitle}`}
                      className="p-1.5 text-text-faint hover:text-cyan transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(entry.id)}
                      aria-label={`Delete history entry for ${entry.issueTitle}`}
                      className="p-1.5 text-text-faint hover:text-danger transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-danger"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
