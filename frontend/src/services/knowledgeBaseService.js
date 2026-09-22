import { issues } from '../data/issues'
import { categories } from '../data/categories'

// Searches the local, always-available knowledge base. This works
// identically online or offline since it never leaves the device.
export function searchOfflineKnowledge(query, filters = {}) {
  const q = query.trim().toLowerCase()

  return issues.filter((issue) => {
    if (filters.category && issue.category !== filters.category) return false
    if (filters.difficulty && issue.difficulty !== filters.difficulty) return false
    if (filters.offlineOnly && !issue.offlineAvailable) return false

    if (!q) return true

    const haystack = [
      issue.title,
      issue.description,
      issue.category,
      ...(issue.symptoms || []),
    ]
      .join(' ')
      .toLowerCase()

    return q.split(/\s+/).every((term) => haystack.includes(term))
  })
}

export function categoryLabel(id) {
  return categories.find((c) => c.id === id)?.name || id
}
