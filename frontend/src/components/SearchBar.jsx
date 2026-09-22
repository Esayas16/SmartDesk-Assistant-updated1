import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search...', autoFocus = false }) {
  return (
    <div className="relative">
      <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-faint" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={placeholder}
        className="w-full bg-panel border border-line rounded-lg pl-11 pr-10 py-3 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-cyan/50 focus:glow-ring transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text transition-colors"
        >
          <X size={15} />
        </button>
      )}
    </div>
  )
}
