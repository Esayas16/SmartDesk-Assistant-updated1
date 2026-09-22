import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { getCategory } from '../data/categories'
import { getIssuesByCategory } from '../data/issues'
import { resolveIcon } from '../utils/iconMap'
import SearchBar from '../components/SearchBar'
import IssueCard from '../components/IssueCard'
import EmptyState from '../components/EmptyState'

export default function CategoryDetail() {
  const { categoryId } = useParams()
  const [query, setQuery] = useState('')
  const category = getCategory(categoryId)

  if (!category) return <Navigate to="/categories" replace />

  const Icon = resolveIcon(category.icon)
  const allIssues = getIssuesByCategory(categoryId)
  const filtered = query
    ? allIssues.filter((i) => i.title.toLowerCase().includes(query.toLowerCase()) || i.description.toLowerCase().includes(query.toLowerCase()))
    : allIssues

  return (
    <div className="space-y-6">
      <Link to="/categories" className="inline-flex items-center gap-1.5 text-text-dim hover:text-cyan text-sm transition-colors">
        <ChevronLeft size={15} /> All categories
      </Link>

      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg border border-cyan/30 bg-cyan/10 flex items-center justify-center text-cyan glow-ring">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold text-text uppercase">{category.name}</h2>
          <p className="text-text-dim text-sm">{allIssues.length} issues \u00b7 {category.description}</p>
        </div>
      </div>

      <SearchBar value={query} onChange={setQuery} placeholder={`Search ${category.name.toLowerCase()} problems...`} />

      {filtered.length === 0 ? (
        <EmptyState title="No matching issues" description="Try a different search term." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  )
}
