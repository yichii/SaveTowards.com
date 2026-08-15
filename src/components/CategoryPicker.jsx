import { Car, Plane, Home, Gift, MoreHorizontal } from 'lucide-react'

export const CATEGORIES = [
  { key: 'car', label: 'Car', icon: Car, emojiOptions: ['🚗', '🚙', '🏎️'] },
  { key: 'travel', label: 'Travel', icon: Plane, emojiOptions: ['✈️', '🧳', '🌴'] },
  { key: 'home', label: 'Home', icon: Home, emojiOptions: ['🏠', '🏡', '🔑'] },
  { key: 'gift', label: 'Gift', icon: Gift, emojiOptions: ['🎁', '💍', '🎉'] },
  { key: 'other', label: 'Other', icon: MoreHorizontal, emojiOptions: ['🎯', '⭐', '💰'] },
]

export function CategoryPicker({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {CATEGORIES.map(({ key, label, icon: Icon }) => {
        const selected = value === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(selected ? '' : key)}
            aria-pressed={selected}
            className={`flex flex-1 flex-col items-center gap-1 rounded-lg border px-2 py-3 text-xs transition-colors ${
              selected
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            <Icon size={20} />
            {label}
          </button>
        )
      })}
    </div>
  )
}
