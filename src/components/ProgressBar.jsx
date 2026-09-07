export function ProgressBar({ percent, showLabel = true }) {
  const clamped = Math.min(Math.max(percent, 0), 100)

  return (
    <div className="w-full">
      <div className="h-3 w-full overflow-hidden rounded-full bg-emerald-100">
        <div
          className="h-full rounded-full bg-emerald-600 transition-all duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && <p className="mt-1 text-xs text-emerald-900/55">{clamped.toFixed(0)}% saved</p>}
    </div>
  )
}
