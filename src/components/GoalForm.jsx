import { useState } from 'react'
import { Lock } from 'lucide-react'
import { CATEGORIES, CategoryPicker } from './CategoryPicker'
import { EmojiPicker } from './EmojiPicker'
import { LivePlanPreview } from './LivePlanPreview'

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

export function GoalForm({ initialGoal, onSave, onCancel }) {
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

  function handleCategoryChange(nextCategory) {
    setCategory(nextCategory)
    setEmoji(CATEGORIES.find((c) => c.key === nextCategory)?.emojiOptions?.[0] ?? '')
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
    } else if (targetDate < todayIso() && !keepingOriginalDate) {
      nextErrors.targetDate = 'Target date can’t be in the past'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    onSave({
      id: initialGoal?.id ?? crypto.randomUUID(),
      name: name.trim(),
      targetAmount: Number(targetAmount),
      amountSaved: initialGoal ? Number(amountSaved) : 0,
      targetDate,
      category,
      emoji,
      payFrequency,
      visualizationStyle: initialGoal?.visualizationStyle ?? 'fill',
      createdAt: initialGoal?.createdAt ?? new Date().toISOString(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <h1 className="font-heading text-xl font-semibold text-stone-900">
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
          placeholder="e.g. Trip to Japan"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
      </div>

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
            step="0.01"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="2000"
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
              step="0.01"
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

      <div className="flex flex-col gap-1">
        <label htmlFor="targetDate" className="text-sm font-medium text-stone-700">
          When do you want to get there?
        </label>
        <input
          id="targetDate"
          type="date"
          min={todayIso()}
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

      <LivePlanPreview
        targetAmount={targetAmount}
        amountSaved={initialGoal ? amountSaved : 0}
        targetDate={targetDate}
        payFrequency={payFrequency}
      />

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-stone-700">
          Category <span className="text-stone-400">(optional)</span>
        </span>
        <CategoryPicker value={category} onChange={handleCategoryChange} />
      </div>

      {category && (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-stone-700">Icon</span>
          <EmojiPicker
            options={CATEGORIES.find((c) => c.key === category)?.emojiOptions}
            value={emoji}
            onChange={setEmoji}
          />
        </div>
      )}

      <p className="mt-2 text-sm text-stone-500">
        {initialGoal ? 'Nice work keeping this up to date.' : "You've got this — every plan starts somewhere."}
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
