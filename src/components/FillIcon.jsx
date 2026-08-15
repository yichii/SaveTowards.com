import { Circle } from 'lucide-react'

/**
 * Renders `icon` twice, stacked: a muted outline as the full shape, and a
 * colored, filled copy clipped to the bottom `percent`% via a height-clipped
 * wrapper. Falls back to a plain circle when no icon is given.
 */
export function FillIcon({ icon, percent, size = 64, celebrating = false }) {
  const clamped = Math.min(Math.max(percent, 0), 100)
  const Icon = icon || Circle

  return (
    <div
      className={`relative shrink-0 ${celebrating ? 'animate-celebrate motion-reduce:animate-none' : ''}`}
      style={{ width: size, height: size }}
    >
      <Icon size={size} strokeWidth={1.5} className="absolute inset-0 text-gray-200" />
      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden transition-all duration-500 ease-out motion-reduce:transition-none"
        style={{ height: `${clamped}%` }}
      >
        <Icon
          size={size}
          strokeWidth={1.5}
          fill="currentColor"
          className="absolute bottom-0 left-0 text-emerald-500"
        />
      </div>
    </div>
  )
}
