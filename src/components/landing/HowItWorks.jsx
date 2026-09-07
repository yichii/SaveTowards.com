import { Target, Coins, TrendingUp } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

// Compact three-step explainer — the at-a-glance answer to "what does this
// site do?". Deliberately a single row of plain steps, not the marketing
// How-It-Works section that was removed earlier.
const STEPS = [
  { icon: Target, title: 'Enter your goal and date' },
  { icon: Coins, title: 'See your daily or weekly amount' },
  { icon: TrendingUp, title: 'Track it as it fills' },
]

export function HowItWorks() {
  return (
    <section className="bg-cream px-4 py-14 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading title="How it works" />
        <ol className="mx-auto grid max-w-md gap-5 sm:max-w-none sm:grid-cols-3 sm:gap-8">
          {STEPS.map(({ icon: Icon, title }, i) => (
            <li key={title} className="flex items-center gap-3 sm:flex-col sm:gap-3 sm:text-center">
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                <Icon size={20} strokeWidth={1.75} />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-[11px] font-bold text-white">
                  {i + 1}
                </span>
              </span>
              <h3 className="font-heading text-sm font-bold text-emerald-950 sm:text-base">{title}</h3>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
