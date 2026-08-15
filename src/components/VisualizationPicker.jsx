import { BarChart2, Droplet, CircleDot, Route } from 'lucide-react'

export const VISUALIZATIONS = [
  { key: 'bar', label: 'Bar', icon: BarChart2 },
  { key: 'fill', label: 'Fill', icon: Droplet },
  { key: 'ring', label: 'Ring', icon: CircleDot },
  { key: 'journey', label: 'Journey', icon: Route },
]

export function VisualizationPicker({ value, onChange, exclude }) {
  const options = exclude ? VISUALIZATIONS.filter((v) => !exclude.includes(v.key)) : VISUALIZATIONS

  return (
    <div className="flex items-center gap-1">
      {options.map(({ key, label, icon: Icon }) => {
        const selected = (value ?? 'fill') === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={selected}
            aria-label={`Use ${label} visualization`}
            title={`${label} visualization`}
            className={`rounded-md p-1.5 transition-colors ${
              selected ? 'bg-emerald-100 text-emerald-700' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
            }`}
          >
            <Icon size={14} />
          </button>
        )
      })}
    </div>
  )
}
