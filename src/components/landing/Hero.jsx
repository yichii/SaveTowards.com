import { ArrowRight } from 'lucide-react'
import { HeroDemo } from './HeroDemo'
import { useHeroDemo } from './useHeroDemo'

export function Hero({ onStart }) {
  const demo = useHeroDemo()

  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-14 sm:pt-20 lg:min-h-[calc(100vh-4.5rem)] lg:flex lg:items-center lg:pb-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 z-0 h-[32rem] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(16,185,129,0.14),rgba(245,158,11,0.08)_45%,transparent_75%)]"
      />
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="flex flex-col items-center text-center lg:max-w-md lg:items-start lg:text-left">
          <h1 className="sr-only">SaveTowards — plan and track any savings goal</h1>
          <div aria-hidden="true">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 sm:justify-start sm:text-3xl">
              <demo.goal.icon
                key={demo.iconKey}
                size={28}
                strokeWidth={2}
                className="text-emerald-600 animate-icon-swap motion-reduce:animate-none"
              />
              SaveTowards
            </div>
            <p className="mt-1 flex items-baseline justify-center text-4xl font-bold tracking-tight text-gray-900 sm:justify-start sm:text-5xl">
              <span className="underline decoration-emerald-400 decoration-4 underline-offset-4">{demo.typed}</span>
              <span className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.1em] bg-gray-900 animate-cursor-blink motion-reduce:animate-none" />
            </p>
          </div>
          <p className="mt-4 max-w-md text-lg text-gray-600">
            Set a goal and a date. We'll give you the number and show your progress as you go.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="mt-8 flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            Start a goal
            <ArrowRight size={18} />
          </button>
        </div>
        <div className="flex w-full justify-center lg:w-96 lg:shrink-0">
          <HeroDemo
            goal={demo.goal}
            percent={demo.percent}
            plan={demo.plan}
            monthsRemaining={demo.monthsRemaining}
            isAutoplay={demo.isAutoplay}
            onSliderPointerDown={demo.onSliderPointerDown}
            onSliderChange={demo.onSliderChange}
            onSliderRelease={demo.onSliderRelease}
            visualization={demo.visualization}
            onVisualizationChange={demo.onVisualizationChange}
          />
        </div>
      </div>
    </section>
  )
}
