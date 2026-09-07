import { calculateSavingsPlan, headlineUnitWord } from '../utils/calculations'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const OPTIONS = [
  { label: '3 more months', months: 3 },
  { label: '6 more months', months: 6 },
  { label: 'A full year', months: 12 },
]

function toIso(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isoDateMonthsOut(months) {
  const now = new Date()
  return toIso(new Date(now.getFullYear(), now.getMonth() + months, now.getDate()))
}

function formatDateLabel(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// A way out for an overdue goal instead of a dead end: a few concrete new
// target dates and what each one would ask per period, applied in a single
// tap. Each option runs the real plan math against a hypothetical date —
// no separate projection to keep in sync.
export function RescheduleNudge({ goal, onReschedule }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-emerald-100 p-4 text-sm text-emerald-900/70">
      <p>
        Your target date has come and gone — it happens, and it&apos;s an easy fix. Pick a new one that
        fits:
      </p>
      <div className="flex flex-col gap-2">
        {OPTIONS.map(({ label, months }) => {
          const targetDate = isoDateMonthsOut(months)
          const plan = calculateSavingsPlan({ ...goal, targetDate })
          const amount = currency.format(plan[plan.headlineUnit])
          const unitWord = headlineUnitWord(plan.headlineUnit)
          return (
            <button
              key={label}
              type="button"
              onClick={() => onReschedule(targetDate)}
              className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 rounded-lg bg-white px-3 py-2 text-left font-medium text-emerald-900 shadow-sm transition-colors hover:bg-emerald-50"
            >
              <span>{label}</span>
              <span className="text-emerald-900/55">
                about {amount}/{unitWord} · by {formatDateLabel(targetDate)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
