const PAY_FREQUENCY_DAYS = {
  weekly: 7,
  biweekly: 14,
  monthly: 30,
}

function daysUntil(targetDate, fromDate = new Date()) {
  // Guard against missing/corrupted data — treat as due today rather than crash.
  if (!targetDate) return 0

  // Parse the "YYYY-MM-DD" string as local date components — new Date(targetDate)
  // treats it as UTC midnight, which shifts a day earlier in timezones behind UTC.
  const [year, month, day] = targetDate.split('-').map(Number)
  const t = new Date(year, month - 1, day)
  const f = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate())
  return Math.round((t - f) / 86400000)
}

/**
 * Computes the savings plan for a goal: status, progress, and required
 * contribution rates. No interest/inflation — simple division only.
 */
export function calculateSavingsPlan(goal) {
  const targetAmount = Math.max(Number(goal.targetAmount) || 0, 0)
  const amountSaved = Math.max(Number(goal.amountSaved) || 0, 0)
  const amountRemaining = Math.max(targetAmount - amountSaved, 0)
  const percentSaved = targetAmount > 0
    ? Math.min((amountSaved / targetAmount) * 100, 100)
    : 100
  const daysRemaining = daysUntil(goal.targetDate)
  const paycheckDays = PAY_FREQUENCY_DAYS[goal.payFrequency] || PAY_FREQUENCY_DAYS.biweekly

  if (amountRemaining <= 0) {
    return {
      status: 'met',
      amountRemaining: 0,
      daysRemaining,
      percentSaved: 100,
      perDay: 0,
      perWeek: 0,
      perMonth: 0,
      perPaycheck: 0,
    }
  }

  // Target date has already passed or is today: no time left to spread
  // contributions over, so the honest number is "save the rest now."
  if (daysRemaining <= 0) {
    return {
      status: daysRemaining === 0 ? 'due-today' : 'overdue',
      amountRemaining,
      daysRemaining,
      percentSaved,
      perDay: amountRemaining,
      perWeek: amountRemaining,
      perMonth: amountRemaining,
      perPaycheck: amountRemaining,
    }
  }

  const perDay = amountRemaining / daysRemaining

  return {
    status: 'on-track',
    amountRemaining,
    daysRemaining,
    percentSaved,
    perDay,
    perWeek: perDay * 7,
    perMonth: perDay * 30,
    perPaycheck: perDay * paycheckDays,
  }
}
