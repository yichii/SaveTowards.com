import { ArrowRight } from 'lucide-react'
import { HeroDemo } from './HeroDemo'
import { RestoreLink } from './RestoreLink'
import { useHeroDemo, SECONDARY_EXAMPLES } from './useHeroDemo'
import { useViewportTier } from '../../hooks/useViewportTier'
import { Logo } from '../Logo'

export function Hero({ onStart, onRestore, onBack }) {
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
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="flex items-center justify-center gap-2 font-heading text-[clamp(0.875rem,2dvh,1.25rem)] font-bold text-stone-600 transition-opacity hover:opacity-80 sm:justify-start"
            >
              <Logo size={22} className="text-cyan-600" />
              SaveTowards
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 font-heading text-[clamp(0.875rem,2dvh,1.25rem)] font-bold text-stone-600 sm:justify-start">
              <Logo size={22} className="text-cyan-600" />
              SaveTowards
            </div>
          )}
          <h1 className="mt-[clamp(0.75rem,2.4dvh,1.5rem)] font-heading text-[clamp(1.25rem,min(6vw,5dvh),3.25rem)] font-bold tracking-tight text-stone-900 lg:text-5xl xl:text-6xl 2xl:text-7xl">
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
              <span className="underline decoration-cyan-400 decoration-4 underline-offset-4">{demo.typed}</span>
              <span className="ml-1 inline-block h-[0.8em] w-[3px] translate-y-[0.1em] bg-stone-900 animate-cursor-blink motion-reduce:animate-none" />
            </span>
          </h1>
          {!ultraCompact && (
            <p className="mt-[clamp(0.625rem,2dvh,1.25rem)] max-w-md text-[clamp(0.8125rem,1.9dvh,1.125rem)] text-stone-600 lg:max-w-lg lg:text-xl xl:max-w-xl xl:text-2xl 2xl:max-w-2xl 2xl:text-3xl">
              Tell us the goal and the date. We'll break it down into something you can actually save each week.
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
          {!ultraCompact && (
            <p className="mt-3 text-xs text-stone-400 lg:text-sm">
              No accounts, no bank link — your data stays yours. Works for {SECONDARY_EXAMPLES} too.
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
    </section>
  )
}
