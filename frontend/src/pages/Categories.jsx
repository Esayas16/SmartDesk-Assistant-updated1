import { categories } from '../data/categories'
import { countByCategory } from '../data/issues'
import CategoryCard from '../components/CategoryCard'

export default function Categories() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-text">Categories</h2>
        <p className="text-text-dim text-sm mt-1">Browse all troubleshooting categories.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} count={countByCategory(c.id)} />
        ))}
      </div>
    </div>
  )
}
