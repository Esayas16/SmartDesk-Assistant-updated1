export default function Toggle({ checked, onChange, label, description, id }) {
  return (
    <label htmlFor={id} className="flex items-center justify-between gap-4 py-3 cursor-pointer">
      <div>
        <p className="text-sm text-text font-medium">{label}</p>
        {description && <p className="text-xs text-text-dim mt-0.5">{description}</p>}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan ${checked ? 'bg-cyan/60' : 'bg-panel-2 border border-line'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </label>
  )
}
