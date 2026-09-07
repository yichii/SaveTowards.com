import { ArrowUp } from 'lucide-react'
import { Logo } from '../Logo'

// Footer links all point at the category hub — they're crawlable anchors that
// also smooth-scroll when JS is on. Labels are phrased for search intent
// ("emergency fund calculator") rather than the short tile labels.
const CALCULATOR_LINKS = [
  'Emergency fund calculator',
  'Vacation savings calculator',
  'Wedding savings calculator',
  'Car savings calculator',
  'Home down payment calculator',
  'Baby savings fund',
  'College savings calculator',
  'Gift savings calculator',
  'Retirement savings goal',
  'Custom savings goal',
]

const FEATURES = [
  'See your goal as a daily, weekly, monthly, or per-paycheck amount',
  'Track progress with a visual goal tracker',
  'Plan several savings goals at once',
  'Change your target date and see the new amount instantly',
  'Export your goals and restore them on another device',
]

export function Footer({ onExplore }) {
  const year = new Date().getFullYear()

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleNav(e) {
    if (!onExplore) return
    e.preventDefault()
    onExplore()
  }

  return (
    <footer className="border-t border-emerald-900/10 bg-cream">
      <div className="mx-auto max-w-5xl px-4 pt-12 pb-[calc(3rem+env(safe-area-inset-bottom))] lg:pt-14">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Logo size={20} className="text-emerald-700" />
              <span className="font-heading text-base font-bold text-emerald-950">SaveTowards</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-emerald-900/60">
              SaveTowards is a free savings goal calculator. Enter a target amount and a date to see
              exactly how much to save per day, week, month, or paycheck to get there — with a visual
              progress tracker. No account, no bank connection, no fees.
            </p>
          </div>

          <nav aria-label="Savings calculators">
            <h2 className="text-xs font-bold uppercase tracking-wide text-emerald-950">
              Savings calculators
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-1">
              {CALCULATOR_LINKS.map((label) => (
                <li key={label}>
                  <a
                    href="#calculators"
                    onClick={handleNav}
                    className="text-xs text-emerald-900/60 transition-colors hover:text-emerald-800"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wide text-emerald-950">
              What you can do
            </h2>
            <ul className="mt-3 space-y-2">
              {FEATURES.map((feature) => (
                <li key={feature} className="text-xs leading-relaxed text-emerald-900/60">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse gap-4 border-t border-emerald-900/10 pt-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-xs leading-relaxed text-emerald-900/50">
            © {year} SaveTowards. Simple savings math for planning only — not financial advice. Always
            consider your personal financial situation before making money decisions.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:text-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            <ArrowUp size={14} />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  )
}
