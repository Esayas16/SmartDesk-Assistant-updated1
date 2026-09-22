import { useEffect, useMemo, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { getHistory, deleteHistoryEntry, clearHistory, syncHistoryFromBackend } from '../services/historyService'
import { categories } from '../data/categories'
import HistoryTable from '../components/HistoryTable'
import SearchBar from '../components/SearchBar'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import { useToast } from '../hooks/useToast'

export default function History() {
  const [entries, setEntries] = useState(getHistory())
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [viewing, setViewing] = useState(null)
  const { showToast } = useToast()

  useEffect(() => {
    let cancelled = false
    syncHistoryFromBackend().then((remote) => {
      if (!cancelled) setEntries(remote)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (category && e.category !== category) return false
      if (query && !e.issueTitle.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [entries, query, category])

  const handleDelete = (id) => {
    setEntries(deleteHistoryEntry(id))
    showToast('History entry deleted.', 'info')
  }

  const handleClearAll = () => {
    clearHistory()
    setEntries([])
    showToast('Troubleshooting history cleared.', 'info')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-text">History</h2>
          <p className="text-text-dim text-sm mt-1">Review your previous troubleshooting sessions.</p>
        </div>
        {entries.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-2 rounded-lg border border-line text-text-dim text-xs font-mono uppercase tracking-wider px-3 py-2 hover:text-danger hover:border-danger/30 transition-colors"
          >
            <Trash2 size={13} /> Clear All
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar value={query} onChange={setQuery} placeholder="Search history..." />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter history by category"
          className="bg-panel border border-line rounded-lg px-3 py-2 text-xs text-text-dim focus:outline-none focus:border-cyan/50"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No history yet" description="Completed diagnostic sessions will appear here." />
      ) : (
        <HistoryTable entries={filtered} onView={setViewing} onDelete={handleDelete} />
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.issueTitle}>
        {viewing && (
          <div className="space-y-2 text-sm text-text-dim">
            <p><span className="text-text-faint">Category:</span> {viewing.category}</p>
            <p><span className="text-text-faint">Result:</span> {viewing.result}</p>
            <p><span className="text-text-faint">Mode:</span> {viewing.mode}</p>
            <p><span className="text-text-faint">Date:</span> {new Date(viewing.date).toLocaleString()}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
