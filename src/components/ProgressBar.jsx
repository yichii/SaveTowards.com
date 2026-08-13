export function ProgressBar({ percent }) {
  const clamped = Math.min(Math.max(percent, 0), 100)

  return (
    <div className="w-full">
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">{clamped.toFixed(0)}% saved</p>
    </div>
  )
}
