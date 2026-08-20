import { useState } from 'react'
import { Lock } from 'lucide-react'
import { CATEGORIES, CategoryPicker } from './CategoryPicker'
import { LivePlanPreview } from './LivePlanPreview'
import { isValidTargetDateString, MAX_YEARS_OUT, maxTargetDateIso } from '../utils/dateValidation'

const PAY_FREQUENCIES = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'biweekly', label: 'Biweekly' },
  { key: 'monthly', label: 'Monthly' },
]

function todayIso() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10)
}

// Amounts are dollars-and-cents — anything typed beyond that (e.g. a stray
// third decimal digit) is rounded away rather than rejected, since it isn't
// meaningfully different from what the user meant.
function roundToCents(value) {
  return Math.round(Number(value) * 100) / 100
}

export function GoalForm({ initialGoal, onSave, onCancel, takeHomePay, onTakeHomePayChange }) {
  const [name, setName] = useState(initialGoal?.name ?? '')
  const [targetAmount, setTargetAmount] = useState(initialGoal ? String(initialGoal.targetAmount) : '')
  const [amountSaved, setAmountSaved] = useState(initialGoal ? String(initialGoal.amountSaved) : '0')
  const [targetDate, setTargetDate] = useState(initialGoal?.targetDate ?? '')
  const [category, setCategory] = useState(initialGoal?.category ?? '')
  const [emoji, setEmoji] = useState(() => {
    if (initialGoal?.emoji) return initialGoal.emoji
    return CATEGORIES.find((c) => c.key === initialGoal?.category)?.emojiOptions?.[0] ?? ''
  })
  const [payFrequency, setPayFrequency] = useState(initialGoal?.payFrequency ?? 'biweekly')
  const [errors, setErrors] = useState({})

  function handleCategoryChange(nextCategory, nextEmoji) {
    setCategory(nextCategory)
    setEmoji(nextEmoji)
  }

  function validate() {
    const nextErrors = {}
    const amount = Number(targetAmount)

    if (!targetAmount || Number.isNaN(amount) || amount <= 0) {
      nextErrors.targetAmount = 'Enter an amount greater than $0'
    }

    if (initialGoal) {
      const saved = Number(amountSaved)
      if (amountSaved === '' || Number.isNaN(saved) || saved < 0) {
        nextErrors.amountSaved = 'Enter an amount of $0 or more'
      }
    }

    const keepingOriginalDate = initialGoal && targetDate === initialGoal.targetDate

    if (!targetDate) {
      nextErrors.targetDate = 'Pick a target date'
    } else if (!isValidTargetDateString(targetDate)) {
      nextErrors.targetDate = `Pick a date within the next ${MAX_YEARS_OUT} years`
    } else if (targetDate < todayIso() && !keepingOriginalDate) {
      nextErrors.targetDate = 'Target date can’t be in the past'
    }

    if (takeHomePay !== '') {
      const pay = Number(takeHomePay)
      if (Number.isNaN(pay) || pay < 0) {
        nextErrors.takeHomePay = 'Enter an amount of $0 or more'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    const now = new Date().toISOString()
    const nextAmountSaved = initialGoal ? roundToCents(amountSaved) : 0
    const savedAmountChanged = !initialGoal || nextAmountSaved !== initialGoal.amountSaved

    onSave({
      id: initialGoal?.id ?? crypto.randomUUID(),
      name: name.trim(),
      targetAmount: roundToCents(targetAmount),
      amountSaved: nextAmountSaved,
      targetDate,
      category,
      emoji,
      payFrequency,
      visualizationStyle: initialGoal?.visualizationStyle ?? 'fill',
      createdAt: initialGoal?.createdAt ?? now,
      lastUpdatedAt: savedAmountChanged ? now : (initialGoal?.lastUpdatedAt ?? now),
      celebrationShown: initialGoal?.celebrationShown ?? false,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="@container flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm lg:p-8">
      <h1 className="font-heading text-xl font-semibold text-stone-900 lg:text-2xl">
        {initialGoal ? 'Update your goal' : "Let's set up your goal"}
      </h1>

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-stone-700">
          What should we call it? <span className="text-stone-400">(optional)</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. House down payment"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
      </div>

      <div className={initialGoal ? 'grid grid-cols-1 gap-4 @lg:grid-cols-2' : ''}>
        <div className="flex flex-col gap-1">
          <label htmlFor="targetAmount" className="text-sm font-medium text-stone-700">
            What are you saving up for?
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">$</span>
            <input
              id="targetAmount"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="25,000"
              className="w-full rounded-lg border border-stone-300 py-2 pl-7 pr-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          {errors.targetAmount && <p className="text-sm text-red-600">{errors.targetAmount}</p>}
        </div>

        {initialGoal && (
          <div className="flex flex-col gap-1">
            <label htmlFor="amountSaved" className="text-sm font-medium text-stone-700">
              How much have you saved so far?
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">$</span>
              <input
                id="amountSaved"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={amountSaved}
                onChange={(e) => setAmountSaved(e.target.value)}
                className="w-full rounded-lg border border-stone-300 py-2 pl-7 pr-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <p className="text-xs text-stone-400">
              Adjust the total here anytime. For day-to-day deposits, use “Add to savings” on the goal card.
            </p>
            {errors.amountSaved && <p className="text-sm text-red-600">{errors.amountSaved}</p>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="targetDate" className="text-sm font-medium text-stone-700">
            When do you want to get there?
          </label>
          <input
            id="targetDate"
            type="date"
            min={todayIso()}
            max={maxTargetDateIso()}
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          {errors.targetDate && <p className="text-sm text-red-600">{errors.targetDate}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-700">How often are you paid?</span>
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
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                      : 'border-stone-200 text-stone-500 hover:border-stone-300'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="takeHomePay" className="text-sm font-medium text-stone-700">
          Take-home pay per paycheck <span className="text-stone-400">(optional)</span>
        </label>
        <div className="relative @lg:max-w-[calc(50%-0.5rem)]">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">$</span>
          <input
            id="takeHomePay"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={takeHomePay}
            onChange={(e) => onTakeHomePayChange(e.target.value)}
            placeholder="Skip if you'd rather not say"
            className="w-full rounded-lg border border-stone-300 py-2 pl-7 pr-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
        <p className="text-xs text-stone-400">Used across all your goals, not just this one.</p>
        {errors.takeHomePay && <p className="text-sm text-red-600">{errors.takeHomePay}</p>}
      </div>

      <LivePlanPreview
        targetAmount={targetAmount}
        amountSaved={initialGoal ? amountSaved : 0}
        targetDate={targetDate}
        payFrequency={payFrequency}
        takeHomePay={takeHomePay}
      />

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-stone-700">
          Category <span className="text-stone-400">(optional)</span>
        </span>
        <CategoryPicker value={category} emoji={emoji} onChange={handleCategoryChange} />
      </div>

      <p className="mt-2 text-sm text-stone-500">
        {initialGoal ? 'Nice work keeping this up to date.' : "Every home starts with a plan."}
      </p>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
        >
          {initialGoal ? 'Save changes' : 'Create goal'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
          >
            Cancel
          </button>
        )}
      </div>

      <p className="flex items-center justify-center gap-1.5 text-xs text-stone-400">
        <Lock size={12} />
        Saved privately on this device — no account needed
      </p>
    </form>
  )
}
