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
export function HeroDemo({
  goal,
  percent,
  plan,
  targetDateLabel,
  isAutoplay,
  onSliderPointerDown,
  onSliderChange,
  onSliderRelease,
  iconSize = 84,
  compact = false,
  ultraCompact = false,
}) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-cyan-100 bg-white/90 p-[clamp(0.875rem,2.6dvh,1.5rem)] shadow-xl shadow-cyan-950/5 backdrop-blur lg:max-w-md lg:p-8 xl:max-w-lg xl:p-9 2xl:max-w-xl 2xl:p-10">
      <div className="mb-[clamp(0.5rem,1.4dvh,1rem)]">
        <p className="min-w-0 truncate text-sm font-medium text-stone-500 lg:text-base xl:text-lg">{goal.label}</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-[clamp(0.375rem,1dvh,0.75rem)] py-[clamp(0.25rem,0.8dvh,0.5rem)] lg:gap-4 lg:py-3 xl:gap-5 xl:py-4">
        <FillIcon emoji={goal.emoji} label={goal.label} percent={percent} size={iconSize} />
        <p className="text-xs font-medium text-stone-500 lg:text-sm xl:text-base">{percent}% saved</p>
      </div>

      {!ultraCompact && (
        <div className="mb-1 flex h-5 items-center justify-center">
          {isAutoplay && (
            <div className="flex items-center gap-1 animate-pulse-soft text-xs font-medium text-cyan-700 motion-reduce:hidden">
              <MousePointerClick size={14} />
              drag me
            </div>
          )}
        </div>
      )}
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
        onPointerUp={onSliderRelease}
        onTouchEnd={onSliderRelease}
        onBlur={onSliderRelease}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-cyan-100
          [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-cyan-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:shadow-cyan-900/25 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150
          [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-cyan-600 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:shadow-cyan-900/25 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:duration-150
          pointer-coarse:[&::-webkit-slider-thumb]:h-7 pointer-coarse:[&::-webkit-slider-thumb]:w-7
          pointer-coarse:[&::-moz-range-thumb]:h-7 pointer-coarse:[&::-moz-range-thumb]:w-7
          hover:[&::-webkit-slider-thumb]:scale-125 hover:[&::-moz-range-thumb]:scale-125
          active:[&::-webkit-slider-thumb]:scale-125 active:[&::-moz-range-thumb]:scale-125"
      />

      <div className={`mt-[clamp(0.5rem,1.4dvh,1rem)] rounded-xl bg-cyan-50 px-4 text-center lg:px-5 ${compact ? 'py-2' : 'py-3 lg:py-4'}`}>
        <p className="font-heading text-[clamp(1.125rem,3dvh,1.5rem)] font-bold text-cyan-700 lg:text-3xl xl:text-4xl 2xl:text-5xl">
          {plan.status === 'met' ? 'Goal reached!' : `${currency.format(plan.perWeek)}/week`}
        </p>
        <p className="text-xs text-cyan-700/70 lg:text-sm xl:text-base">
          {plan.status === 'met' ? "That's the whole thing, paid for." : `to get there by ${targetDateLabel}`}
        </p>
      </div>
    </div>
  )
}
