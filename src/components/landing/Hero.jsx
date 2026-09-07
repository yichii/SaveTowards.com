import { ChevronDown } from 'lucide-react'
import { HeroDemo } from './HeroDemo'
import { RestoreLink } from './RestoreLink'
import { useHeroDemo, SECONDARY_EXAMPLES } from './useHeroDemo'
import { useViewportTier } from '../../hooks/useViewportTier'

export function Hero({ onScrollToHub, onRestore }) {
  const demo = useHeroDemo()
  const { compact, ultraCompact, wide } = useViewportTier()
  const iconSize = ultraCompact ? 48 : wide ? 108 : compact ? 64 : 84

  return (
    <section className="relative flex min-h-[calc(100dvh-3.25rem)] flex-col items-center justify-center overflow-x-clip px-4 py-[clamp(1.5rem,3dvh,3rem)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 z-0 h-[32rem] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(6,95,70,0.16),rgba(217,119,6,0.08)_45%,transparent_75%)]"
      />
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-[clamp(0.75rem,3.5dvh,3rem)] lg:flex-row lg:items-center lg:justify-between lg:max-w-6xl lg:gap-16 xl:max-w-7xl xl:gap-20 2xl:max-w-[90rem] 2xl:gap-24">
        <div className="flex flex-col items-center text-center lg:max-w-xl lg:items-start lg:text-left xl:max-w-2xl 2xl:max-w-3xl">
          <h1 className="font-heading text-[clamp(1.25rem,min(6vw,5dvh),3.25rem)] font-bold tracking-tight text-stone-900 lg:text-5xl xl:text-6xl 2xl:text-7xl">
            <span className="sr-only">
              How do I start saving for my first house, our Japan trip, a Tacoma TRD Pro, or my sister's wedding?
            </span>
            {/* Prefix and animated ending are separate fixed-height lines so the
                typing/deleting animation only changes line width, never line
                count — nothing below the headline shifts while it plays. */}
            <span aria-hidden="true" className="block whitespace-nowrap">
              How do I start saving for
            </span>
            <span aria-hidden="true" className="block whitespace-nowrap">
              <span className="underline decoration-emerald-400 decoration-4 underline-offset-4">{demo.typed}</span>
              <span className="ml-1 inline-block h-[0.8em] w-[3px] translate-y-[0.1em] bg-stone-900 animate-cursor-blink motion-reduce:animate-none" />
            </span>
          </h1>
          {!ultraCompact && (
            <p className="mt-[clamp(0.625rem,2dvh,1.25rem)] max-w-md text-[clamp(0.8125rem,1.9dvh,1.125rem)] text-stone-600 lg:max-w-lg lg:text-xl xl:max-w-xl xl:text-2xl 2xl:max-w-2xl 2xl:text-3xl">
              Pick a goal, pick a date, and we&apos;ll show you what to save each week — visualized, and with no account or bank link.
            </p>
          )}
          <button
            type="button"
            onClick={onScrollToHub}
            className="mt-[clamp(0.875rem,2.4dvh,2rem)] flex w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:w-auto sm:max-w-none sm:py-[clamp(0.5rem,1.4dvh,0.75rem)] lg:px-8 lg:py-4 lg:text-lg xl:px-10 xl:py-5 xl:text-xl"
          >
            See the calculators
            <ChevronDown size={18} />
          </button>
          {!ultraCompact && (
            <p className="mt-3 hidden text-xs text-stone-400 sm:block lg:text-sm">
              A dedicated Home, Car, and Retirement calculator are on the way. Works for {SECONDARY_EXAMPLES} too.
            </p>
          )}
          <RestoreLink onRestore={onRestore} />
        </div>
        <div className="flex w-full justify-center lg:w-[26rem] lg:shrink-0 xl:w-[30rem] 2xl:w-[34rem]">
          <HeroDemo
            goal={demo.goal}
            percent={demo.percent}
            plan={demo.plan}
            targetDateLabel={demo.targetDateLabel}
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

      {!compact && (
        <button
          type="button"
          onClick={onScrollToHub}
          aria-hidden="true"
          tabIndex={-1}
          className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 text-emerald-700/50 transition-colors hover:text-emerald-700 motion-safe:animate-bounce sm:block"
        >
          <ChevronDown size={26} />
        </button>
      )}
    </section>
  )
}
