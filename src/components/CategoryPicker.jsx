import { useEffect, useRef, useState } from 'react'
import { Car, Plane, Home, Gift, MoreHorizontal } from 'lucide-react'

export const CATEGORIES = [
  { key: 'home', label: 'Home', icon: Home, emojiOptions: ['🏠', '🏡', '🔑'] },
  { key: 'car', label: 'Car', icon: Car, emojiOptions: ['🚗', '🚙', '🏎️'] },
  { key: 'travel', label: 'Travel', icon: Plane, emojiOptions: ['✈️', '🧳', '🌴'] },
  { key: 'gift', label: 'Gift', icon: Gift, emojiOptions: ['🎁', '💍', '🎉'] },
  { key: 'other', label: 'Other', icon: MoreHorizontal, emojiOptions: ['🎯', '⭐', '💰', '📈', '💸'] },
]

// value/onChange cover the category; emoji/onChange also carries the icon so
// picking one from the submenu is a single round-trip to the parent instead
// of two separate state updates landing in different renders.
export function CategoryPicker({ value, emoji, onChange }) {
  const [openKey, setOpenKey] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!openKey) return
    function handlePointerDown(e) {
      if (!containerRef.current?.contains(e.target)) setOpenKey(null)
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [openKey])

  function handleCategoryClick(key) {
    if (value === key) {
      if (openKey === key) {
        onChange('', '')
        setOpenKey(null)
      } else {
        setOpenKey(key)
      }
      return
    }

    const nextCategory = CATEGORIES.find((c) => c.key === key)
    onChange(key, nextCategory?.emojiOptions?.[0] ?? '')
    setOpenKey(key)
  }

  function handleEmojiSelect(key, nextEmoji) {
    onChange(key, nextEmoji)
    setOpenKey(null)
  }

  return (
    <div ref={containerRef} className="flex gap-2">
      {CATEGORIES.map(({ key, label, icon: Icon, emojiOptions }, index) => {
        const selected = value === key
        const open = openKey === key
        const isFirst = index === 0
        const isLast = index === CATEGORIES.length - 1
        const menuPositionClasses = isFirst
          ? 'left-0'
          : isLast
            ? 'right-0'
            : 'left-1/2 -translate-x-1/2'

        return (
          <div key={key} className="relative flex-1">
            <button
              type="button"
              onClick={() => handleCategoryClick(key)}
              aria-pressed={selected}
              aria-expanded={open}
              className={`flex w-full flex-col items-center gap-1 rounded-lg border px-2 py-3 text-xs transition-colors ${
                selected
                  ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                  : 'border-stone-200 text-stone-500 hover:border-stone-300'
              }`}
            >
              {selected && emoji ? (
                <span className="text-xl leading-none" aria-hidden="true">{emoji}</span>
              ) : (
                <Icon size={20} />
              )}
              {label}
            </button>

            {open && (
              <div className={`absolute top-full z-10 mt-2 flex gap-1.5 rounded-lg border border-stone-200 bg-white p-2 shadow-md ${menuPositionClasses}`}>
                {emojiOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleEmojiSelect(key, option)}
                    aria-pressed={emoji === option}
                    aria-label={`Use ${option} icon`}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-lg transition-colors ${
                      emoji === option
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <span aria-hidden="true">{option}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
