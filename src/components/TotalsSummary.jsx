import { useEffect, useState } from 'react'
import { CheckCircle2, ChevronDown, ChevronUp, PiggyBank } from 'lucide-react'
import {
  calculateCombinedPlan,
  calculateSavingsPlan,
  headlineUnitWord,
  paceComparison,
  progressPhrase,
} from '../utils/calculations'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function TotalsSummary({ goals, onCelebrationShown }) {
  const [showMore, setShowMore] = useState(false)
  const combined = calculateCombinedPlan(goals)

  // Gated on total goal count, not active count — once someone has 2+ goals
  // this card stays put as they get met one by one, down to a single goal
  // remaining active, rather than disappearing right when a goal is reached.
  // Requiring 2+ (not just 1) keeps it from ever appearing for a genuine
  // single-goal account, where it would just repeat that one card's numbers.
  //
  // Captured once at mount (not recomputed from the live `goals` prop) so
  // that marking it shown below doesn't immediately make this component pick
  // the *next* uncelebrated goal and mark that one too in the same visit —
  // each goal gets its own turn on a later mount instead of several being
  // silently flagged shown without ever having their message rendered.
  const [celebratingGoal] = useState(
    () =>
      goals
        .filter((g) => calculateSavingsPlan(g).status === 'met' && !g.celebrationShown)
        .sort((a, b) => new Date(b.lastUpdatedAt || 0) - new Date(a.lastUpdatedAt || 0))[0] ?? null
  )

  // Marks the celebration as shown only once it has actually been rendered
  // (this effect only runs after that paint), so a goal never gets flagged
  // "celebrated" without the user having seen the message.
  useEffect(() => {
    if (celebratingGoal) onCelebrationShown(celebratingGoal.id)
  }, [celebratingGoal])

  if (combined.totalGoalsCount < 2) return null

  const allMet = combined.activeGoalsCount === 0
  const headlineValue = combined[combined.headlineUnit]
  const headlineWord = headlineUnitWord(combined.headlineUnit)
  const pace = paceComparison(combined.perDay)
  // With exactly one goal still active, the combined totals are just that
  // goal's own numbers — "Show more" would only repeat the individual card
  // beneath it, so there's nothing supplementary to reveal.
  const hasSupplementaryDetail = combined.activeGoalsCount > 1

  return (
    <div className="@container mb-4 flex flex-col gap-3 rounded-xl border border-cyan-200 bg-cyan-50/50 p-6 shadow-sm lg:mb-6">
      <div className="flex items-center gap-2 text-sm font-medium text-cyan-800">
        <PiggyBank size={16} />
        All goals combined
      </div>

      {allMet ? (
        <p className="flex items-center gap-2 font-heading text-2xl font-semibold text-cyan-700">
          <CheckCircle2 size={24} className="shrink-0 text-cyan-600" />
          All {combined.totalGoalsCount} goal{combined.totalGoalsCount === 1 ? '' : 's'} reached
          {celebratingGoal ? ' 🎉' : ''}!
        </p>
      ) : (
        <>
          <p className="font-heading text-2xl font-semibold text-stone-900">
            {celebratingGoal
              ? `1 goal complete 🎉 — ${combined.activeGoalsCount} to go`
              : `${currency.format(headlineValue)}/${headlineWord} across ${combined.activeGoalsCount} goal${
                  combined.activeGoalsCount === 1 ? '' : 's'
                }`}
          </p>

          <p className="text-sm text-stone-500">
            {pace || progressPhrase(combined.percentSaved)}
          </p>
        </>
      )}

      {!allMet && hasSupplementaryDetail && (
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="flex items-center gap-1 self-start text-sm font-medium text-cyan-700 hover:text-cyan-800"
        >
          {showMore ? 'Show less' : 'Show more'}
          {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}

      {!allMet && hasSupplementaryDetail && showMore && combined.breakdownMode === 'single-line' && (
        <p className="rounded-lg bg-white/60 p-4 text-sm text-stone-600">
          {combined.daysRemaining > 0
            ? `${currency.format(combined.totalAmountRemaining)} left, with ${combined.daysRemaining} day${combined.daysRemaining === 1 ? '' : 's'} to go.`
            : `${currency.format(combined.totalAmountRemaining)} left to save.`}
        </p>
      )}

      {!allMet && hasSupplementaryDetail && showMore && combined.breakdownMode === 'grid' && (
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-white/60 p-4 text-sm @sm:grid-cols-4">
          {combined.rows.filter((row) => row.visible).map((row) => (
            <div key={row.key}>
              <p className="text-stone-500">{row.label}</p>
              <p className="font-semibold text-stone-900">{currency.format(row.value)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
