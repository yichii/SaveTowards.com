import { useState } from 'react'
import { CheckCircle2, ChevronDown, ChevronUp, PiggyBank } from 'lucide-react'
import { calculateCombinedPlan } from '../utils/calculations'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function TotalsSummary({ goals }) {
  const [showMore, setShowMore] = useState(false)
  const combined = calculateCombinedPlan(goals)

  // Gated on how many goals exist, not how many are still active — once
  // someone has 2+ goals this card should stay put as they get met one by
  // one, rather than disappearing right when a goal is reached.
  if (combined.totalGoalsCount < 2) return null

  const allMet = combined.activeGoalsCount === 0

  return (
    <div className="@container mb-4 flex flex-col gap-3 rounded-xl border border-cyan-200 bg-cyan-50/50 p-6 shadow-sm lg:mb-6">
      <div className="flex items-center gap-2 text-sm font-medium text-cyan-800">
        <PiggyBank size={16} />
        All goals combined
      </div>

      {allMet ? (
        <p className="flex items-center gap-2 font-heading text-2xl font-semibold text-cyan-700">
          <CheckCircle2 size={24} className="shrink-0 text-cyan-600" />
          All {combined.totalGoalsCount} goals reached!
        </p>
      ) : (
        <>
          <p className="font-heading text-2xl font-semibold text-stone-900">
            {currency.format(combined.perWeek)}/week across {combined.activeGoalsCount} goal
            {combined.activeGoalsCount === 1 ? '' : 's'}
          </p>

          <p className="text-sm text-stone-500">
            {currency.format(combined.totalAmountRemaining)} left to save toward{' '}
            {currency.format(combined.totalTargetAmount)} total
          </p>
        </>
      )}

      {!allMet && (
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="flex items-center gap-1 self-start text-sm font-medium text-cyan-700 hover:text-cyan-800"
        >
          {showMore ? 'Show less' : 'Show more'}
          {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}

      {!allMet && showMore && (
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-white/60 p-4 text-sm @sm:grid-cols-4">
          <div>
            <p className="text-stone-500">Per day</p>
            <p className="font-semibold text-stone-900">{currency.format(combined.perDay)}</p>
          </div>
          <div>
            <p className="text-stone-500">Per week</p>
            <p className="font-semibold text-stone-900">{currency.format(combined.perWeek)}</p>
          </div>
          <div>
            <p className="text-stone-500">Per month</p>
            <p className="font-semibold text-stone-900">{currency.format(combined.perMonth)}</p>
          </div>
          {combined.perPaycheck != null && (
            <div>
              <p className="text-stone-500">Per paycheck</p>
              <p className="font-semibold text-stone-900">{currency.format(combined.perPaycheck)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
