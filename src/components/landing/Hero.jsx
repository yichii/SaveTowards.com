import { ArrowRight } from 'lucide-react'
import { HeroDemo } from './HeroDemo'
import { useHeroDemo } from './useHeroDemo'
import { useViewportTier } from '../../hooks/useViewportTier'

export function Hero({ onStart }) {
  const demo = useHeroDemo()
  const { compact, ultraCompact, wide } = useViewportTier()
  const iconSize = ultraCompact ? 48 : wide ? 108 : compact ? 64 : 84

  return (
    <section className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-4 py-[clamp(0.5rem,3dvh,3rem)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 z-0 h-[32rem] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(16,185,129,0.14),rgba(245,158,11,0.08)_45%,transparent_75%)]"
      />
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-[clamp(0.75rem,3.5dvh,3rem)] lg:flex-row lg:items-center lg:justify-between lg:max-w-6xl lg:gap-16 xl:max-w-7xl xl:gap-20 2xl:max-w-[90rem] 2xl:gap-24">
        <div className="flex flex-col items-center text-center lg:max-w-xl lg:items-start lg:text-left xl:max-w-2xl 2xl:max-w-3xl">
          <h1 className="sr-only">SaveTowards — plan and track any savings goal</h1>
          <div aria-hidden="true">
            <div className="flex items-center justify-center gap-2 font-heading text-[clamp(1rem,2.8dvh,1.875rem)] font-bold text-stone-900 sm:justify-start lg:text-3xl xl:text-4xl 2xl:text-4xl">
              <demo.goal.icon
                key={demo.iconKey}
                size={iconSize < 84 ? 22 : 28}
                strokeWidth={2}
                className="text-cyan-600 animate-icon-swap motion-reduce:animate-none lg:h-8 lg:w-8 xl:h-9 xl:w-9 2xl:h-9 2xl:w-9"
              />
              SaveTowards
            </div>
            <p className="mt-1 whitespace-nowrap font-heading text-[clamp(1.375rem,4.6dvh,3rem)] font-bold tracking-tight text-stone-900 lg:text-5xl xl:text-6xl 2xl:text-7xl">
              <span className="underline decoration-cyan-400 decoration-4 underline-offset-4">{demo.typed}</span>
              <span className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.1em] bg-stone-900 animate-cursor-blink motion-reduce:animate-none" />
            </p>
          </div>
          {!ultraCompact && (
            <p className="mt-[clamp(0.5rem,1.6dvh,1rem)] max-w-md text-[clamp(0.8125rem,1.9dvh,1.125rem)] text-stone-600 lg:max-w-lg lg:text-xl xl:max-w-xl xl:text-2xl 2xl:max-w-2xl 2xl:text-3xl">
              Set a goal and a date. We'll give you the number and show your progress as you go.
            </p>
          )}
          <button
            type="button"
            onClick={onStart}
            className="mt-[clamp(0.625rem,2.4dvh,2rem)] flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-[clamp(0.5rem,1.4dvh,0.75rem)] text-base font-semibold text-white shadow-sm transition-colors hover:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 lg:px-8 lg:py-4 lg:text-lg xl:px-10 xl:py-5 xl:text-xl"
          >
            Start a goal
            <ArrowRight size={18} />
          </button>
        </div>
        <div className="flex w-full justify-center lg:w-[26rem] lg:shrink-0 xl:w-[30rem] 2xl:w-[34rem]">
          <HeroDemo
            goal={demo.goal}
            percent={demo.percent}
            plan={demo.plan}
            monthsRemaining={demo.monthsRemaining}
            isAutoplay={demo.isAutoplay}
            onSliderPointerDown={demo.onSliderPointerDown}
            onSliderChange={demo.onSliderChange}
            onSliderRelease={demo.onSliderRelease}
            iconSize={iconSize}
            compact={compact}
            ultraCompact={ultraCompact}
          />
        </div>
      </div>
    </section>
  )
}
