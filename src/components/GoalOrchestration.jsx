import { useState } from 'react'
import { Layers } from 'lucide-react'
import {
  calculateSavingsPlan,
  formatDurationDiff,
  projectDateForRate,
  windowDaysForUnit,
} from '../utils/calculations'
import { CATEGORIES } from './CategoryPicker'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const wholeCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function formatDateLabel(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Every active goal's own required monthly rate — the amount currently
// keeping it on its stored target date — expressed on a common "per month"
// window regardless of pay frequency, so the goals can share one pie to
// allocate from.
function requiredMonthlyRate(goal, plan) {
  return plan.perDay * windowDaysForUnit('perMonth', goal.payFrequency)
}

// Moves `changedId` to `newAmount` (clamped to the shared pie) and shrinks
// or grows every other goal's share proportionally to what it already had,
// so the total always stays pinned to `total` — a hard-cap allocation
// model rather than letting the pie over/under-fill.
function reallocate(allocations, changedId, newAmount, total) {
  const clamped = Math.min(Math.max(newAmount, 0), total)
  const others = allocations.filter((a) => a.id !== changedId)
  const othersSum = others.reduce((sum, a) => sum + a.amount, 0)
  const remaining = total - clamped

  return allocations.map((a) => {
    if (a.id === changedId) return { ...a, amount: clamped }
    const share = othersSum > 0 ? a.amount / othersSum : 1 / others.length
    return { ...a, amount: remaining * share }
  })
}

// Rescales every allocation to a new total, preserving relative shares —
// used when the "total available" figure itself changes.
function rescale(allocations, newTotal) {
  const sum = allocations.reduce((s, a) => s + a.amount, 0)
  if (sum <= 0) {
    const even = newTotal / allocations.length
    return allocations.map((a) => ({ ...a, amount: even }))
  }
  return allocations.map((a) => ({ ...a, amount: (a.amount / sum) * newTotal }))
}

export function GoalOrchestration({ goals, onApply }) {
  const activePlans = goals
    .map((goal) => ({ goal, plan: calculateSavingsPlan(goal) }))
    .filter(({ plan }) => plan.status !== 'met' && plan.status !== 'overdue')

  const excluded = goals
    .map((goal) => ({ goal, plan: calculateSavingsPlan(goal) }))
    .filter(({ plan }) => plan.status === 'met' || plan.status === 'overdue')

  const initialTotal = Math.max(
    1,
    Math.round(activePlans.reduce((sum, { goal, plan }) => sum + requiredMonthlyRate(goal, plan), 0))
  )

  const [totalAvailable, setTotalAvailable] = useState(initialTotal)
  const [allocations, setAllocations] = useState(() =>
    activePlans.map(({ goal, plan }) => ({ id: goal.id, amount: requiredMonthlyRate(goal, plan) }))
  )

  if (activePlans.length < 2) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-6 text-sm text-stone-600 shadow-sm">
        <p>You need at least two active goals to plan an allocation across them.</p>
        {excluded.length > 0 && (
          <p className="text-xs text-stone-400">
            Not counted: {excluded.map(({ goal, plan }) => `${goal.name || 'Savings goal'} (${plan.status === 'met' ? 'goal reached' : 'past due'})`).join(', ')}
          </p>
        )}
      </div>
    )
  }

  function handleTotalChange(value) {
    const next = Math.max(0, Number(value) || 0)
    setTotalAvailable(next)
    setAllocations((prev) => rescale(prev, next))
  }

  function handleAllocationChange(id, value) {
    const next = Math.max(0, Number(value) || 0)
    setAllocations((prev) => reallocate(prev, id, next, totalAvailable))
  }

  function handleResetSplit() {
    setAllocations(
      activePlans.map(({ goal, plan }) => {
        const required = requiredMonthlyRate(goal, plan)
        const requiredTotal = activePlans.reduce((sum, g) => sum + requiredMonthlyRate(g.goal, g.plan), 0)
        const share = requiredTotal > 0 ? required / requiredTotal : 1 / activePlans.length
        return { id: goal.id, amount: totalAvailable * share }
      })
    )
  }

  const projections = activePlans.map(({ goal, plan }) => {
    const allocation = allocations.find((a) => a.id === goal.id)?.amount ?? 0
    const projection = projectDateForRate({
      amountRemaining: plan.amountRemaining,
      rate: allocation,
      windowDays: windowDaysForUnit('perMonth', goal.payFrequency),
      fromDate: new Date(),
    })
    const deltaDays = Number.isFinite(projection.daysNeeded) ? projection.daysNeeded - plan.daysRemaining : null
    return { goal, plan, allocation, projection, deltaLabel: deltaDays !== null ? formatDurationDiff(deltaDays) : null }
  })

  const canApply = projections.every((p) => p.projection.targetDate)

  function handleApply() {
    onApply(
      projections
        .filter((p) => p.projection.targetDate)
        .map((p) => ({ id: p.goal.id, targetDate: p.projection.targetDate }))
    )
  }

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-cyan-800">
        <Layers size={16} />
        Plan across goals
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="totalAvailable" className="text-sm font-medium text-stone-700">
          Total available per month
        </label>
        <div className="relative w-40">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">$</span>
          <input
            id="totalAvailable"
            type="number"
            inputMode="decimal"
            min="0"
            value={totalAvailable}
            onChange={(e) => handleTotalChange(e.target.value)}
            className="w-full rounded-lg border border-stone-300 py-2 pl-7 pr-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {projections.map(({ goal, allocation, projection, deltaLabel }) => {
          const category = CATEGORIES.find((c) => c.key === goal.category)
          const Icon = category?.icon
          return (
            <div key={goal.id} className="flex flex-col gap-2 rounded-lg bg-stone-50 p-4 text-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2 text-stone-700">
                  {Icon && <Icon size={16} className="shrink-0" />}
                  <span className="truncate font-medium">{goal.name || 'Savings goal'}</span>
                </div>
                <span className="shrink-0 font-semibold text-stone-900">{currency.format(allocation)}/mo</span>
              </div>
              <input
                type="range"
                min={0}
                max={totalAvailable}
                step={Math.max(1, Math.round(totalAvailable / 200))}
                value={Math.round(allocation)}
                onChange={(e) => handleAllocationChange(goal.id, e.target.value)}
                className="w-full accent-cyan-600"
                aria-label={`Monthly allocation for ${goal.name || 'this goal'}`}
              />
              <p className="text-stone-600">
                {projection.targetDate
                  ? `Reaches goal by ${formatDateLabel(projection.targetDate)}${deltaLabel ? ` — ${deltaLabel}` : ''}`
                  : "This amount won't get there — allocate more."}
              </p>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-stone-500">
        {wholeCurrency.format(totalAvailable)} allocated across {activePlans.length} goal
        {activePlans.length === 1 ? '' : 's'} — every dollar assigned.
      </p>

      {excluded.length > 0 && (
        <p className="text-xs text-stone-400">
          Not included: {excluded.map(({ goal, plan }) => `${goal.name || 'Savings goal'} (${plan.status === 'met' ? 'goal reached' : 'past due'})`).join(', ')}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-stone-100 pt-4">
        <button
          type="button"
          onClick={handleApply}
          disabled={!canApply}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          Apply this plan
        </button>
        <button
          type="button"
          onClick={handleResetSplit}
          className="text-sm font-medium text-stone-500 hover:text-stone-700"
        >
          Reset to proportional split
        </button>
        {!canApply && (
          <span className="text-xs text-amber-700">Some goals won't be reached at their current allocation.</span>
        )}
      </div>
    </div>
  )
}
