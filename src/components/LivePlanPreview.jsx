import { calculateSavingsPlan } from '../utils/calculations'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function LivePlanPreview({ targetAmount, amountSaved, targetDate, payFrequency }) {
  const amount = Number(targetAmount)
  const validAmount = targetAmount !== '' && !Number.isNaN(amount) && amount > 0
  const validDate = !!targetDate

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-stone-700">Your savings plan</span>
      <div className="rounded-lg bg-stone-50 p-4 text-sm">
        {!validAmount || !validDate ? (
          <p className="text-stone-500">Fill in the amount and date to see your savings plan.</p>
        ) : (
          <PlanBreakdown
            plan={calculateSavingsPlan({
              targetAmount: amount,
              amountSaved: Number(amountSaved) || 0,
              targetDate,
              payFrequency,
            })}
          />
        )}
      </div>
    </div>
  )
}

function PlanBreakdown({ plan }) {
  if (plan.status === 'met') {
    return <p className="text-stone-500">You've already reached this goal — nice work!</p>
  }

  if (plan.status === 'overdue') {
    return <p className="text-stone-500">This date has already passed — pick a date in the future to see a plan.</p>
  }

  if (plan.status === 'due-today') {
    return <p className="text-stone-500">Target date is today — you'd need {currency.format(plan.amountRemaining)} today.</p>
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div>
        <p className="text-stone-500">Per day</p>
        <p className="font-semibold text-stone-900">{currency.format(plan.perDay)}</p>
      </div>
      <div>
        <p className="text-stone-500">Per week</p>
        <p className="font-semibold text-stone-900">{currency.format(plan.perWeek)}</p>
      </div>
      <div>
        <p className="text-stone-500">Per month</p>
        <p className="font-semibold text-stone-900">{currency.format(plan.perMonth)}</p>
      </div>
      <div>
        <p className="text-stone-500">Per paycheck</p>
        <p className="font-semibold text-stone-900">{currency.format(plan.perPaycheck)}</p>
      </div>
    </div>
  )
}
