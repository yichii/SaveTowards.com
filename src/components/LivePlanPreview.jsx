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

  if (plan.breakdownMode === 'single-line') {
    return (
      <p className="text-stone-500">
        {plan.daysRemaining > 0
          ? `${currency.format(plan.amountRemaining)} left, with ${plan.daysRemaining} day${plan.daysRemaining === 1 ? '' : 's'} to go.`
          : `${currency.format(plan.amountRemaining)} left to save.`}
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {plan.rows.filter((row) => row.visible).map((row) => (
        <div key={row.key}>
          <p className="text-stone-500">{row.label}</p>
          <p className="font-semibold text-stone-900">{currency.format(row.value)}</p>
        </div>
      ))}
    </div>
  )
}
