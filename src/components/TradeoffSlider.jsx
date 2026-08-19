import { useEffect, useState } from 'react'
import {
  formatDurationDiff,
  headlineUnitWord,
  projectDateForRate,
  windowDaysForUnit,
} from '../utils/calculations'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

// Slider range is relative to the goal's own required rate rather than a
// fixed dollar range, so it stays sensible whether the goal needs $2/day or
// $200/day. Floored at $1 so the rate (and the resulting daily rate) is
// always > 0 — projectDateForRate has no meaningful answer at rate 0.
const MIN_RATE_FACTOR = 0.25
const MAX_RATE_FACTOR = 3

function formatDateLabel(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function TradeoffSlider({ goal, plan, onApplyRate }) {
  const unit = plan.headlineUnit
  const unitWord = headlineUnitWord(unit)
  const windowDays = windowDaysForUnit(unit, goal.payFrequency)
  const currentRate = Math.max(Math.round(plan[unit]), 1)

  const min = Math.max(1, Math.round(currentRate * MIN_RATE_FACTOR))
  const max = Math.max(min + 1, Math.round(currentRate * MAX_RATE_FACTOR))
  const step = Math.max(1, Math.round((max - min) / 100))

  const [rate, setRate] = useState(currentRate)

  // Re-baseline the preview whenever the goal's actual plan changes
  // underneath it (editing the goal, adding savings, applying a rate, or
  // this card mounting for a different goal) — a stale preview should never
  // linger against an outdated baseline. Keyed on the plan's own derived
  // numbers (not just the rounded display rate) so a change that shifts
  // which unit headlines or how many days/dollars remain — without
  // coincidentally changing the rounded rate — still resets the slider.
  useEffect(() => {
    setRate(currentRate)
  }, [goal.id, unit, currentRate, plan.amountRemaining, plan.daysRemaining])

  const isCurrentRate = rate === currentRate

  // At the untouched (current-rate) position, show the goal's own stored
  // target date rather than re-deriving one from the rounded display rate —
  // projectDateForRate's Math.ceil rounding can land a day off from the
  // real target date, which would read as a contradiction right under the
  // headline stat showing that same date.
  const projection = isCurrentRate
    ? { targetDate: goal.targetDate }
    : projectDateForRate({
        amountRemaining: plan.amountRemaining,
        rate,
        windowDays,
        fromDate: new Date(),
      })

  const deltaDays = !isCurrentRate && Number.isFinite(projection.daysNeeded)
    ? projection.daysNeeded - plan.daysRemaining
    : null
  const diffLabel = deltaDays !== null ? formatDurationDiff(deltaDays) : null

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-stone-50 p-4 text-sm">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={`rate-${goal.id}`} className="font-medium text-stone-700">
          What if I saved this much per {unitWord}?
        </label>
        <span className="font-semibold text-stone-900">{currency.format(rate)}</span>
      </div>
      <input
        id={`rate-${goal.id}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={rate}
        onChange={(e) => setRate(Number(e.target.value))}
        className="w-full accent-cyan-600"
        aria-label={`Contribution per ${unitWord}`}
      />
      <p className="text-stone-600">
        {projection.targetDate
          ? isCurrentRate
            ? `Right on track — you'd reach this goal by ${formatDateLabel(projection.targetDate)}.`
            : deltaDays < 0
              ? `Nice — you'd reach this goal by ${formatDateLabel(projection.targetDate)}, ${diffLabel}!`
              : `You'd still reach this goal by ${formatDateLabel(projection.targetDate)}${diffLabel ? `, ${diffLabel}` : ''} — that works too.`
          : "That rate won't quite get you there — try a bit higher."}
      </p>
      {!isCurrentRate && projection.targetDate && onApplyRate && (
        <button
          type="button"
          onClick={() => onApplyRate(projection.targetDate)}
          className="self-start rounded-lg bg-cyan-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700"
        >
          Apply this rate
        </button>
      )}
    </div>
  )
}
