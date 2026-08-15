import { MousePointerClick } from 'lucide-react'
import { FillIcon } from '../FillIcon'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

/**
 * Presentational demo card — autoplay vs. manual control is decided by the
 * caller (useHeroDemo) and passed in, so this component just renders state.
 */
export function HeroDemo({ goal, percent, plan, monthsRemaining, isAutoplay, onSliderPointerDown, onSliderChange }) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-xl shadow-emerald-950/5 backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-gray-500">{goal.label}</p>
        <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">Fill</span>
      </div>

      <div className="flex min-h-[6.5rem] flex-col items-center justify-center gap-3 py-2">
        <FillIcon icon={goal.icon} percent={percent} size={84} />
        <p className="text-xs font-medium text-gray-500">{percent}% saved</p>
      </div>

      <div className="mb-1 flex h-5 items-center justify-center">
        {isAutoplay && (
          <div className="flex items-center gap-1 animate-pulse-soft text-xs font-medium text-emerald-700 motion-reduce:hidden">
            <MousePointerClick size={14} />
            drag me
          </div>
        )}
      </div>
      <label htmlFor="hero-demo-slider" className="sr-only">
        Percent of goal saved, drag to try it yourself
      </label>
      <input
        id="hero-demo-slider"
        type="range"
        min={0}
        max={100}
        value={percent}
        onPointerDown={onSliderPointerDown}
        onTouchStart={onSliderPointerDown}
        onChange={(e) => onSliderChange(Number(e.target.value))}
        className="w-full accent-emerald-600"
      />

      <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-center">
        <p className="text-2xl font-bold text-emerald-700">
          {plan.status === 'met' ? 'Goal reached!' : `${currency.format(plan.perWeek)}/week`}
        </p>
        <p className="text-xs text-emerald-700/70">
          {plan.status === 'met' ? "That's the whole thing, paid for." : `to get there in ${monthsRemaining} months`}
        </p>
      </div>
    </div>
  )
}
