import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { Logo } from '../../components/Logo'
import { StandaloneCalculator } from './StandaloneCalculator'
import { SEO_CALCULATORS } from './registry'

const currencyWhole = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const AVG_DAYS_PER_MONTH = 30.44
const PAYCHECK_DAYS = { weekly: 7, biweekly: 14, monthly: AVG_DAYS_PER_MONTH, daily: 1 }

// Illustrative only — plain division over a synthetic `months * 30.44` day
// window, no calendar. Keeps the "rough example" line identical on the server
// and client; the live calculator below uses the real target date.
function roughExample(amount, months, payFrequency) {
  const perDay = amount / (months * AVG_DAYS_PER_MONTH)
  return {
    perWeek: perDay * 7,
    perMonth: perDay * AVG_DAYS_PER_MONTH,
    perPaycheck: perDay * (PAYCHECK_DAYS[payFrequency] ?? PAYCHECK_DAYS.biweekly),
  }
}

// One standalone, single-purpose calculator page (e.g. /vacation-savings-
// calculator). Rendered to static HTML at build time by scripts/prerender.js
// and hydrated on the client by src/main.jsx. Everything here must render the
// same on server and client — no `window`/`Date` in the render path.
export function SeoCalculatorPage({ def }) {
  useEffect(() => {
    document.title = def.title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', def.description)
  }, [def])

  const ex = roughExample(def.preset.amount, def.preset.months, def.preset.payFrequency)
  const others = SEO_CALCULATORS.filter((c) => c.slug !== def.slug)

  return (
    <div className="min-h-dvh bg-cream">
      <header className="sticky top-0 z-40 border-b border-emerald-950/30 bg-emerald-900 text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-2.5 sm:py-3">
          <a href="/" className="flex items-center gap-2 font-heading text-[15px] font-bold sm:text-base">
            <Logo size={20} className="shrink-0 text-white" />
            SaveTowards
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-white/20 sm:px-3 sm:text-sm"
          >
            Open the full planner
            <ArrowRight size={15} className="shrink-0" />
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 lg:py-14">
        <nav aria-label="Breadcrumb" className="text-xs text-emerald-900/50">
          <a href="/" className="transition-colors hover:text-emerald-800">
            Home
          </a>
          <span className="mx-1.5">/</span>
          <span className="text-emerald-900/70">{def.navLabel}</span>
        </nav>

        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">
          {def.h1}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-emerald-900/70 sm:text-lg">
          {def.lede}
        </p>

        <div className="mt-8">
          <StandaloneCalculator
            preset={def.preset}
            amountLabel={def.amountLabel}
            amountPlaceholder={def.amountPlaceholder}
          />
          <p className="mt-3 text-sm text-emerald-900/60">
            Rough example: {currencyWhole.format(def.preset.amount)} over about {def.preset.months}{' '}
            months is around {currencyWhole.format(ex.perMonth)}/month,{' '}
            {currencyWhole.format(ex.perWeek)}/week, or {currencyWhole.format(ex.perPaycheck)} per
            paycheck. Enter your own amount and date above for your number.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {def.body.map(({ h2, p }) => (
            <section key={h2}>
              <h2 className="font-heading text-xl font-bold text-emerald-950">{h2}</h2>
              <p className="mt-2 leading-relaxed text-emerald-900/70">{p}</p>
            </section>
          ))}
        </div>

        <section className="mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="font-heading text-xl font-bold text-emerald-950">
            Common questions
          </h2>
          <dl className="mt-4 space-y-5">
            {def.faqs.map(({ q, a }) => (
              <div key={q}>
                <dt className="font-semibold text-emerald-950">{q}</dt>
                <dd className="mt-1 leading-relaxed text-emerald-900/70">{a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12 rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-bold text-emerald-950">
            Saving for more than one thing?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-emerald-900/70">
            The full planner keeps every goal in one place, tracks progress with a visual tracker, and
            lets you shift a target date and see the new amount instantly. Still free, still private,
            still stored only on your device.
          </p>
          <a
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
          >
            Open the full planner
            <ArrowRight size={16} />
          </a>
        </section>

        <nav className="mt-12" aria-label="Other savings calculators">
          <h2 className="font-heading text-lg font-bold text-emerald-950">Other savings calculators</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {others.map((c) => (
              <li key={c.slug}>
                <a
                  href={`/${c.slug}`}
                  className="text-sm text-emerald-700 transition-colors hover:text-emerald-800"
                >
                  {c.navLabel}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </main>

      <footer className="border-t border-emerald-900/10 bg-cream">
        <div className="mx-auto max-w-3xl px-4 py-8 text-xs leading-relaxed text-emerald-900/50">
          © {new Date().getFullYear()} SaveTowards. Simple savings math for planning only — not
          financial advice. Always consider your personal financial situation before making money
          decisions. <a href="/" className="text-emerald-700 hover:text-emerald-800">Home</a>
        </div>
      </footer>
    </div>
  )
}
