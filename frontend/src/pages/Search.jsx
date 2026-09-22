import { useMemo, useState } from 'react'
import { WifiOff } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import IssueCard from '../components/IssueCard'
import EmptyState from '../components/EmptyState'
import { categories } from '../data/categories'
import { searchOfflineKnowledge } from '../services/knowledgeBaseService'
import { useApp } from '../hooks/AppContext'

const EXAMPLES = [
  'I have no internet',
  'My printer is offline',
  'My monitor has no signal',
  'My keyboard is not detected',
  'My Wi-Fi keeps disconnecting',
]

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

export default function Search() {
  const { online } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [offlineOnly, setOfflineOnly] = useState(false)

  const results = useMemo(
    () => searchOfflineKnowledge(query, { category, difficulty, offlineOnly }),
    [query, category, difficulty, offlineOnly]
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-text">Search Troubleshooting Knowledge</h2>
        <p className="text-text-dim text-sm mt-1 flex items-center gap-1.5">
          {!online && <WifiOff size={13} className="text-cyan" />}
          Works entirely from the local knowledge base, online or offline.
        </p>
      </div>

      <SearchBar value={query} onChange={setQuery} placeholder="Describe your problem..." autoFocus />

      {!query && (
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setQuery(ex)}
              className="rounded-full border border-line text-text-dim text-xs px-3 py-1.5 hover:text-cyan hover:border-cyan/30 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className="bg-panel border border-line rounded-lg px-3 py-2 text-xs text-text-dim focus:outline-none focus:border-cyan/50"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          aria-label="Filter by difficulty"
          className="bg-panel border border-line rounded-lg px-3 py-2 text-xs text-text-dim focus:outline-none focus:border-cyan/50"
        >
          <option value="">All Difficulties</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 bg-panel border border-line rounded-lg px-3 py-2 text-xs text-text-dim cursor-pointer">
          <input type="checkbox" checked={offlineOnly} onChange={(e) => setOfflineOnly(e.target.checked)} className="accent-cyan" />
          Offline Available
        </label>
      </div>

      <p className="text-xs text-text-faint font-mono uppercase tracking-wider">{results.length} results</p>

      {results.length === 0 ? (
        <EmptyState title="No matching articles" description="Try different keywords or clear your filters." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  )
}
