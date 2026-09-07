import { ArrowUp } from 'lucide-react'
import { Logo } from '../Logo'

// "What you can save for" — search-intent phrasing that links to the
// standalone calculator page for that goal where one exists, or to the goal
// hub on this page (/#start) otherwise. `handleNav` only intercepts the
// hub link for smooth-scroll; real page links navigate normally.
const PLAN_LINKS = [
  { label: 'Saving for an emergency fund', href: '/emergency-fund-calculator' },
  { label: 'Saving for a vacation', href: '/vacation-savings-calculator' },
  { label: 'Saving for a wedding', href: '/wedding-savings-calculator' },
  { label: 'Saving for a baby', href: '/baby-savings-calculator' },
  { label: 'Saving for college', href: '/college-savings-calculator' },
  { label: 'Saving for a car', href: '/car-savings-calculator' },
  { label: 'Saving for a home down payment', href: '/house-down-payment-savings-calculator' },
  { label: 'Saving for a gift or the holidays', href: '/christmas-savings-calculator' },
  { label: 'How much to save per paycheck', href: '/how-much-to-save-per-paycheck' },
  { label: 'Saving for retirement', href: '/#start' },
  { label: 'Saving for anything else', href: '/savings-goal-calculator' },
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

  // Only the goal-hub link is a smooth-scroll on this page; every other link
  // is a real navigation to a standalone calculator page.
  function handleHubNav(e) {
    if (!onExplore) return
    e.preventDefault()
    onExplore()
  }

  return (
    <footer className="border-t border-emerald-900/10 bg-cream">
      <div className="mx-auto max-w-5xl px-4 pt-14 pb-[calc(3rem+env(safe-area-inset-bottom))] lg:pt-20">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Logo size={20} className="text-emerald-700" />
              <span className="font-heading text-base font-bold text-emerald-950">SaveTowards</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-emerald-900/60">
              SaveTowards turns a savings goal and a target date into a plan you can actually follow —
              how much to set aside per day, week, month, or paycheck, with a visual tracker as it
              fills. No account, no bank connection, no fees.
            </p>
          </div>

          <nav aria-label="What you can save for">
            <h2 className="text-xs font-bold uppercase tracking-wide text-emerald-950">
              What you can save for
            </h2>
            <ul className="mt-3 space-y-2">
              {PLAN_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={href === '/#start' ? handleHubNav : undefined}
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
