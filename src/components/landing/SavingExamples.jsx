import { SectionHeading } from './SectionHeading'

// A slim, honest relatability strip between the hero and the goal hub —
// concrete goals a broad audience actually saves for, not testimonials or
// user-count claims. Non-interactive on purpose: it sets context, the hub is
// the CTA. Amounts and phrasing stay specific and plain.
const EXAMPLES = [
  '$1,200 for a flight to Lisbon',
  '$4,000 for a wedding photographer',
  '$8,500 for a first car',
  'three months of expenses, just in case',
  '$300 for holiday gifts',
  '$600 for new tires',
  '$15,000 for a down payment',
  '$900 for a better laptop',
]

export function SavingExamples() {
  return (
    <section className="bg-cream px-4 py-14 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <SectionHeading title="What people save toward" />
        <ul className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
          {EXAMPLES.map((example) => (
            <li
              key={example}
              className="rounded-full border border-emerald-900/10 bg-white px-3.5 py-1.5 text-[13px] leading-snug text-emerald-900/70 shadow-[0_1px_3px_rgba(6,78,59,0.06)] sm:text-sm"
            >
              {example}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
