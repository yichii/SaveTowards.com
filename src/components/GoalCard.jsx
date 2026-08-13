import { useState } from 'react'
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react'
import { calculateSavingsPlan } from '../utils/calculations'
import { ProgressBar } from './ProgressBar'
import { CATEGORIES } from './CategoryPicker'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

function headline(plan, goal) {
  // Parse as local date components — new Date(goal.targetDate) treats a
  // "YYYY-MM-DD" string as UTC midnight, which can display a day early.
  const [year, month, day] = goal.targetDate.split('-').map(Number)
  const dateLabel = new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  if (plan.status === 'met') return "You've hit your goal! 🎉"
  if (plan.status === 'due-today') return `Save ${currency.format(plan.amountRemaining)} today to reach this goal`
  if (plan.status === 'overdue') return `Target date passed — ${currency.format(plan.amountRemaining)} still needed`
  return `${currency.format(plan.perWeek)}/week to reach this by ${dateLabel}`
}

export function GoalCard({ goal, onUpdateSaved, onEdit, onDelete }) {
  const [showMore, setShowMore] = useState(false)
  const [savedInput, setSavedInput] = useState('')

  const plan = calculateSavingsPlan(goal)
  const Icon = CATEGORIES.find((c) => c.key === goal.category)?.icon

  function handleUpdateSaved(e) {
    e.preventDefault()
    const amount = Number(savedInput)
    if (Number.isNaN(amount) || amount < 0) return
    onUpdateSaved(goal.id, amount)
    setSavedInput('')
  }

  function handleDelete() {
    if (window.confirm('Delete this savings goal? This can’t be undone.')) {
      onDelete(goal.id)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {Icon && <Icon size={16} />}
          <span>{goal.name || 'Savings goal'}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(goal.id)}
            aria-label="Edit goal"
            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            aria-label="Delete goal"
            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <p className="text-2xl font-semibold text-gray-900">{headline(plan, goal)}</p>

      <ProgressBar percent={plan.percentSaved} />

      <p className="text-sm text-gray-500">
        {currency.format(goal.amountSaved)} of {currency.format(goal.targetAmount)} saved
      </p>

      <button
        type="button"
        onClick={() => setShowMore((v) => !v)}
        className="flex items-center gap-1 self-start text-sm font-medium text-emerald-700 hover:text-emerald-800"
      >
        {showMore ? 'Show less' : 'Show more'}
        {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {showMore && (
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-gray-500">Per day</p>
            <p className="font-semibold text-gray-900">{currency.format(plan.perDay)}</p>
          </div>
          <div>
            <p className="text-gray-500">Per week</p>
            <p className="font-semibold text-gray-900">{currency.format(plan.perWeek)}</p>
          </div>
          <div>
            <p className="text-gray-500">Per month</p>
            <p className="font-semibold text-gray-900">{currency.format(plan.perMonth)}</p>
          </div>
          <div>
            <p className="text-gray-500">Per paycheck</p>
            <p className="font-semibold text-gray-900">{currency.format(plan.perPaycheck)}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleUpdateSaved} className="flex items-end gap-2 border-t border-gray-100 pt-4">
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="savedAmount" className="text-sm font-medium text-gray-700">
            Update amount saved
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              id="savedAmount"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={savedInput}
              onChange={(e) => setSavedInput(e.target.value)}
              placeholder={String(goal.amountSaved)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-7 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
        >
          Update
        </button>
      </form>
    </div>
  )
}
