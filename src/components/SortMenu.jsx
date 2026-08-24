import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { SORT_OPTIONS } from '../utils/sortGoals'

export function SortMenu({ sortType, direction, onChange }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const activeOption = SORT_OPTIONS.find((o) => o.key === sortType)

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-white p-2 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-50 lg:px-4 lg:py-2"
      >
        <ArrowUpDown size={16} className="shrink-0" />
        <span className="hidden lg:inline">Sort{activeOption ? `: ${activeOption.label}` : ''}</span>
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-lg border border-stone-200 bg-white py-1 text-sm shadow-lg">
          {SORT_OPTIONS.map((option) => {
            const isActive = option.key === sortType
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onChange(option.key)}
                className={`flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-stone-50 ${
                  isActive ? 'font-semibold text-cyan-700' : 'text-stone-600'
                }`}
              >
                {option.label}
                {isActive && (direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
