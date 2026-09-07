import { ChevronDown } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

// Fresh FAQ section (an earlier footer FAQ was removed — this is a redesign,
// not a restore). Plain <details>/<summary> accordion: no JS state, and every
// answer stays in the DOM for crawlers. A FAQPage JSON-LD block mirrors the
// same Q&A for rich results, matching the SEO intent of the footer.
const ITEMS = [
  {
    q: 'How does SaveTowards work out how much to save?',
    a: 'It takes what you have left to save (your target minus what you have already put aside) and divides it by the number of days until your target date. That daily number becomes your weekly, monthly, and per-paycheck amounts. No interest, no inflation, no fine print — just the plain math.',
  },
  {
    q: 'Is it free? Do I need an account?',
    a: 'It is completely free and there is no sign-up. You never connect a bank or enter card details. Just type in a goal and a date.',
  },
  {
    q: 'Where is my data stored?',
    a: 'Everything stays in your browser on this device. Nothing is sent to a server. You can export your goals to a file and load them on another device whenever you want.',
  },
  {
    q: 'What happens if I miss a week or my target date passes?',
    a: 'Nothing breaks. The next time you open your goal it recalculates from what is left and the time remaining, so your per-week amount just adjusts. You can also move the target date and see the new number straight away.',
  },
  {
    q: 'Can I save for more than one thing at once?',
    a: 'Yes. Add as many goals as you like — a car, a trip, an emergency cushion — and track each one separately.',
  },
  {
    q: 'Does it account for interest or investment growth?',
    a: 'No, and that is on purpose. SaveTowards is a planning tool for money you set aside, not an investment projection. Keeping it to simple division makes the number easy to trust and act on.',
  },
]

export function FAQ() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ITEMS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <section id="faq" className="scroll-mt-20 bg-cream px-4 py-14 lg:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          title="Questions people ask"
          subtitle="The short version of how SaveTowards works."
        />

        <ul className="space-y-3">
          {ITEMS.map(({ q, a }) => (
            <li key={q}>
              <details className="group rounded-xl border border-emerald-900/10 bg-white shadow-[0_1px_3px_rgba(6,78,59,0.06)] transition-colors open:border-emerald-700/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-left text-sm font-semibold text-emerald-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:px-5 sm:text-base">
                  {q}
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-emerald-700 transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="px-4 pb-4 text-sm leading-relaxed text-emerald-900/70 sm:px-5 sm:text-[15px]">
                  {a}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
