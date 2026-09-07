import { useEffect, useState } from 'react'
import { calculateSavingsPlan, headlineUnitWord } from '../../utils/calculations'
import { useHydrated } from '../../hooks/useHydrated'
import { maxTargetDateIso } from '../../utils/dateValidation'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const currencyWhole = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const PAY_FREQUENCIES = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'biweekly', label: 'Biweekly' },
  { key: 'monthly', label: 'Monthly' },
]

function todayIso() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10)
}

// Target date `months` out, as YYYY-MM-DD. Only called from an effect (never
// during render) so the server render — which has no real "today" — stays
// deterministic and hydration doesn't diverge.
function isoMonthsFromNow(months) {
  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth() + months, now.getDate())
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Self-contained version of the goal calculator for the standalone SEO pages:
// the same calculations.js math as the dashboard, but no localStorage, no
// saved goal, and one prominent headline number with the full day/week/month/
// paycheck breakdown behind a toggle (per the product's headline-stat rule).
export function StandaloneCalculator({ preset, amountLabel = 'Savings goal', amountPlaceholder = '5,000' }) {
  const hydrated = useHydrated()
  const [amount, setAmount] = useState(preset?.amount != null ? String(preset.amount) : '')
  const [saved, setSaved] = useState('0')
  const [targetDate, setTargetDate] = useState('')
  const [payFrequency, setPayFrequency] = useState(preset?.payFrequency ?? 'biweekly')
  const [showBreakdown, setShowBreakdown] = useState(false)

  // Fill in a sensible default date once we're on the client. Leaving it empty
  // for the server render means the placeholder state renders identically on
  // both sides; the user can still change it.
  useEffect(() => {
    if (preset?.months) setTargetDate((current) => current || isoMonthsFromNow(preset.months))
  }, [preset?.months])

  const amountNum = Number(amount)
  const savedNum = Number(saved) || 0
  const inputsReady =
    hydrated && amount !== '' && !Number.isNaN(amountNum) && amountNum > 0 && !!targetDate

  const plan = inputsReady
    ? calculateSavingsPlan({ targetAmount: amountNum, amountSaved: savedNum, targetDate, payFrequency })
    : null

  return (
    <div className="rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-sm sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={amountLabel} htmlFor="stc-amount">
          <MoneyInput
            id="stc-amount"
            value={amount}
            onChange={setAmount}
            placeholder={amountPlaceholder}
          />
        </Field>

        <Field label="Saved so far" htmlFor="stc-saved">
          <MoneyInput id="stc-saved" value={saved} onChange={setSaved} placeholder="0" />
        </Field>

        <Field label="Target date" htmlFor="stc-date">
          <input
            id="stc-date"
            type="date"
            min={hydrated ? todayIso() : undefined}
            max={hydrated ? maxTargetDateIso() : undefined}
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full rounded-lg border border-emerald-900/20 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </Field>

        <Field label="How often you're paid" htmlFor="stc-pay">
          <div className="flex gap-2">
            {PAY_FREQUENCIES.map(({ key, label }) => {
              const selected = payFrequency === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPayFrequency(key)}
                  aria-pressed={selected}
                  className={`flex-1 rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                    selected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-emerald-900/15 text-emerald-900/60 hover:border-emerald-900/30'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </Field>
      </div>

      <Result
        plan={plan}
        hydrated={hydrated}
        showBreakdown={showBreakdown}
        onToggleBreakdown={() => setShowBreakdown((v) => !v)}
      />
    </div>
  )
}

function Field({ label, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-medium text-emerald-900">
        {label}
      </label>
      {children}
    </div>
  )
}

function MoneyInput({ id, value, onChange, placeholder }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-900/40">$</span>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min="0"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-emerald-900/20 py-2 pl-7 pr-3 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
      />
    </div>
  )
}

function Result({ plan, hydrated, showBreakdown, onToggleBreakdown }) {
  const wrapper = 'mt-5 rounded-xl bg-emerald-50 p-4 sm:p-5'

  // Server render and first client render land here — identical on both sides.
  if (!hydrated || !plan) {
    return (
      <div className={wrapper}>
        <p className="text-sm text-emerald-900/60">
          Enter an amount and a future date to see how much to save.
        </p>
      </div>
    )
  }

  if (plan.status === 'met') {
    return (
      <div className={wrapper}>
        <p className="text-sm text-emerald-900/70">
          You&apos;ve already saved enough for this goal — nice work.
        </p>
      </div>
    )
  }

  if (plan.status === 'overdue') {
    return (
      <div className={wrapper}>
        <p className="text-sm text-emerald-900/70">
          That date has already passed. Pick a date in the future to see a plan.
        </p>
      </div>
    )
  }

  if (plan.status === 'due-today') {
    return (
      <div className={wrapper}>
        <p className="text-sm text-emerald-900/70">
          Your target date is today — you&apos;d need {currency.format(plan.amountRemaining)} now.
        </p>
      </div>
    )
  }

  const headlineRow = plan.rows.find((r) => r.key === plan.headlineUnit)
  const visibleRows = plan.rows.filter((r) => r.visible)

  return (
    <div className={wrapper}>
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700/80">Save about</p>
      <p className="font-heading text-3xl font-bold text-emerald-950 sm:text-4xl">
        {currencyWhole.format(headlineRow.value)}
        <span className="text-lg font-semibold text-emerald-900/60"> / {headlineUnitWord(plan.headlineUnit)}</span>
      </p>
      <p className="mt-1 text-sm text-emerald-900/60">
        {currency.format(plan.amountRemaining)} to go
        {plan.daysRemaining > 0
          ? ` over ${plan.daysRemaining} day${plan.daysRemaining === 1 ? '' : 's'}`
          : ''}
        .
      </p>

      {visibleRows.length > 1 && (
        <>
          <button
            type="button"
            onClick={onToggleBreakdown}
            aria-expanded={showBreakdown}
            className="mt-3 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
          >
            {showBreakdown ? 'Hide breakdown' : 'Show breakdown'}
          </button>

          {showBreakdown && (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {visibleRows.map((row) => (
                <div key={row.key}>
                  <p className="text-xs text-emerald-900/60">{row.label}</p>
                  <p className="font-semibold text-emerald-950">{currency.format(row.value)}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <p className="mt-4 text-xs text-emerald-900/50">
        Simple division — no interest or inflation. A planning estimate, not financial advice.
      </p>
    </div>
  )
}
