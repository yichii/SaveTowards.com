const PAY_FREQUENCY_DAYS = {
  daily: 1,
  weekly: 7,
  biweekly: 14,
  monthly: 30.44,
}

// Long-run average days per month (365.25 / 12), used so "per month" isn't
// skewed by flat 30-day assumption across 28-31 day months.
const AVG_DAYS_PER_MONTH = 30.44

const ROW_LABELS = {
  perDay: 'Per day',
  perWeek: 'Per week',
  perMonth: 'Per month',
  perPaycheck: 'Per paycheck',
}

// Below this, income share isn't called out — the dollar figure alone is enough.
export const HIGH_INCOME_SHARE_THRESHOLD = 50

const UNIT_WORDS = {
  perDay: 'day',
  perWeek: 'week',
  perMonth: 'month',
  perPaycheck: 'paycheck',
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

// Required savings and take-home pay both scale linearly off a per-day rate,
// so the share of income is the same fraction no matter which window
// (day/week/month/paycheck) you compute it over — one scalar covers all of them.
function computeIncomeShare({ takeHomePay, paycheckDays, perDay }) {
  if (!takeHomePay || takeHomePay <= 0) return null
  const takeHomePerDay = takeHomePay / paycheckDays
  return (perDay / takeHomePerDay) * 100
}

// A row is meaningful only if its window actually fits inside the time
// left — otherwise its figure would extrapolate past what's actually
// remaining. Per-day is always kept, and window sizes are fixed (per-month's
// 30.44 days is always >= any pay-frequency window), so this ordering is
// also a valid "largest window first" ordering for headline fallback.
function buildRows({ perDay, perWeek, perMonth, perPaycheck, paycheckDays, daysRemaining }) {
  const windowDays = { perDay: 1, perWeek: 7, perMonth: AVG_DAYS_PER_MONTH, perPaycheck: paycheckDays }
  const values = { perDay, perWeek, perMonth, perPaycheck }

  return ['perDay', 'perWeek', 'perMonth', 'perPaycheck'].map((key) => ({
    key,
    label: ROW_LABELS[key],
    value: values[key],
    visible: key === 'perDay' || windowDays[key] <= daysRemaining,
  }))
}

function pickHeadlineUnit(rows) {
  const visible = new Set(rows.filter((r) => r.visible).map((r) => r.key))
  if (visible.has('perWeek')) return 'perWeek'
  return ['perMonth', 'perPaycheck', 'perDay'].find((key) => visible.has(key)) ?? 'perDay'
}

/**
 * Computes the savings plan for a goal: derived state, progress, and
 * required contribution rates. No interest/inflation — simple division
 * only. All goal "state" (status, which breakdown rows are meaningful,
 * which unit headlines with) is derived here in one place so more states
 * can be added later without scattering conditionals through the UI.
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
  const takeHomePay = Math.max(Number(goal.takeHomePay) || 0, 0)

  if (amountRemaining <= 0) {
    const rows = buildRows({ perDay: 0, perWeek: 0, perMonth: 0, perPaycheck: 0, paycheckDays, daysRemaining })
    return {
      status: 'met',
      amountRemaining: 0,
      daysRemaining,
      percentSaved: 100,
      perDay: 0,
      perWeek: 0,
      perMonth: 0,
      perPaycheck: 0,
      rows,
      breakdownMode: 'grid',
      headlineUnit: 'perWeek',
      headlineIncomeShare: null,
      exceedsFullPaycheck: false,
    }
  }

  // Target date has already passed or is today: no time left to spread
  // contributions over, so the honest number is "save the rest now" — every
  // wider window necessarily exceeds the time left too.
  const perDay = daysRemaining > 0 ? amountRemaining / daysRemaining : amountRemaining
  const perWeek = perDay * 7
  const perMonth = perDay * AVG_DAYS_PER_MONTH
  const perPaycheck = perDay * paycheckDays

  const incomeShare = computeIncomeShare({ takeHomePay, paycheckDays, perDay })
  const rows = buildRows({ perDay, perWeek, perMonth, perPaycheck, paycheckDays, daysRemaining })
  const visibleNonDayRows = rows.filter((r) => r.key !== 'perDay' && r.visible)
  const breakdownMode = visibleNonDayRows.length === 0 ? 'single-line' : 'grid'
  const headlineUnit = pickHeadlineUnit(rows)

  let status
  if (daysRemaining < 0) status = 'overdue'
  else if (daysRemaining === 0) status = 'due-today'
  else if (visibleNonDayRows.length < 3) status = 'deadline-imminent'
  else status = 'on-track'

  return {
    status,
    amountRemaining,
    daysRemaining,
    percentSaved,
    perDay,
    perWeek,
    perMonth,
    perPaycheck,
    rows,
    breakdownMode,
    headlineUnit,
    headlineIncomeShare: incomeShare,
    exceedsFullPaycheck: incomeShare != null ? incomeShare >= 100 : false,
  }
}

export function headlineUnitWord(unit) {
  return UNIT_WORDS[unit] ?? 'week'
}

// Same window sizes buildRows uses for visibility, exposed so callers (the
// tradeoff slider) can convert a chosen "$X per <unit>" rate to a daily rate
// without duplicating the pay-frequency lookup.
export function windowDaysForUnit(unit, payFrequency) {
  const paycheckDays = PAY_FREQUENCY_DAYS[payFrequency] || PAY_FREQUENCY_DAYS.biweekly
  return { perDay: 1, perWeek: 7, perMonth: AVG_DAYS_PER_MONTH, perPaycheck: paycheckDays }[unit] ?? 1
}

function toISODateString(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Projects the date a goal would be reached at a hypothetical contribution
 * rate — the inverse of calculateSavingsPlan's perDay math. Used by the
 * tradeoff slider to preview "what if I saved $X/period" without touching
 * the goal's stored targetDate. Rate must be > 0 (callers should floor
 * their slider range above zero) — a non-positive rate never reaches the
 * goal, so there's no date to project.
 */
export function projectDateForRate({ amountRemaining, rate, windowDays, fromDate = new Date() }) {
  if (amountRemaining <= 0) return { daysNeeded: 0, targetDate: toISODateString(fromDate) }
  const perDay = rate / windowDays
  if (perDay <= 0) return { daysNeeded: Infinity, targetDate: null }

  // A rate that covers the whole remaining amount within a single day's
  // pace needs no extra days at all — reachable today (daysNeeded: 0), not
  // "tomorrow." Without this, Math.ceil below floors at 1 for any nonzero
  // remainder, which made due-today goals always project one day later than
  // the current plan no matter how large the chosen rate was.
  if (amountRemaining <= perDay) return { daysNeeded: 0, targetDate: toISODateString(fromDate) }

  const daysNeeded = Math.ceil(amountRemaining / perDay)
  const projected = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate() + daysNeeded)
  return { daysNeeded, targetDate: toISODateString(projected) }
}

// Above this, an exact day/week/month count stops being meaningful to a
// reader — "11 years earlier" reads the same as "14 years earlier" — so
// formatDurationDiff rounds off to a floor instead of an exact count.
const LONG_HORIZON_DAYS = 3650

/**
 * Turns a day-count difference between two projected dates into a short,
 * human-scale phrase ("3 weeks earlier", "2 months later"). Returns null
 * for no meaningful difference (same day).
 */
export function formatDurationDiff(deltaDays) {
  if (!Number.isFinite(deltaDays) || deltaDays === 0) return null

  const direction = deltaDays < 0 ? 'earlier' : 'later'
  const abs = Math.abs(deltaDays)

  if (abs >= LONG_HORIZON_DAYS) return `over 10 years ${direction}`
  if (abs < 14) return `${abs} day${abs === 1 ? '' : 's'} ${direction}`
  if (abs < AVG_DAYS_PER_MONTH * 2) {
    const weeks = Math.round(abs / 7)
    return `${weeks} week${weeks === 1 ? '' : 's'} ${direction}`
  }
  const months = Math.round(abs / AVG_DAYS_PER_MONTH)
  return `${months} month${months === 1 ? '' : 's'} ${direction}`
}

// Everyday-cost bands to make a daily figure feel doable rather than
// abstract, each paired with a short second-person nudge so it reads as
// encouragement rather than a trivia fact. Ordered smallest-first; the
// first band whose ceiling the per-day amount fits under wins. Deliberately
// food/drink-based and generic (no brand names) so it reads for a broad,
// non-finance audience. Above the top band the comparison stops feeling
// relatable, so callers should fall back to progressPhrase instead.
const PACE_COMPARISONS = [
  { upTo: 2, phrase: "Less than a candy bar a day — you'll barely notice it." },
  { upTo: 5, phrase: 'About a coffee a day. Easy to keep up.' },
  { upTo: 10, phrase: 'About a lunch out a day — very doable.' },
  { upTo: 20, phrase: 'About a takeout dinner a day — worth it for this one.' },
]

/**
 * Returns a relatable everyday comparison (as a complete, ready-to-render
 * sentence) for a per-day savings amount, or null if the amount is too
 * large for a food/drink comparison to feel encouraging rather than
 * trivializing.
 */
export function paceComparison(perDay) {
  const band = PACE_COMPARISONS.find(({ upTo }) => perDay <= upTo)
  return band ? band.phrase : null
}

// Percent-complete bands for a warm nudge when a dollar-based comparison
// (paceComparison) doesn't apply — ordered highest-first so the first band
// the percent clears wins.
const PROGRESS_PHRASES = [
  { atLeast: 75, phrase: "Almost there — the finish line's close." },
  { atLeast: 50, phrase: 'More than halfway there — keep the momentum going.' },
  { atLeast: 25, phrase: 'Well underway. Nice progress.' },
  { atLeast: 0.01, phrase: "Ambitious, but you're already moving." },
]

/** Returns a percent-complete encouragement phrase, no dollar figures. */
export function progressPhrase(percentSaved) {
  const band = PROGRESS_PHRASES.find(({ atLeast }) => percentSaved >= atLeast)
  return band ? band.phrase : 'Every bit from here counts.'
}

/**
 * Combines per-goal plans into one required-savings figure, so someone with
 * several goals can see what they add up to. Sums each active goal's perDay
 * (already accounts for that goal's own deadline/overdue edge cases) and
 * derives week/month from it — the same linear-scaling trick calculateSavingsPlan
 * uses, so it stays correct no matter how many goals are combined. Per-paycheck
 * only makes sense to sum when every active goal shares the same pay frequency;
 * otherwise it's left out rather than showing a number that mixes windows.
 *
 * A period row is only shown if it's visible on *every* contributing active
 * goal's own card (reusing that goal's own row.visible) — a wider window is
 * only meaningful for the combined total if every goal, not just the
 * average, actually has that much runway left. Suppressing the whole row
 * rather than dropping the one goal that doesn't support it keeps the shown
 * total honest about which goals it represents.
 */
export function calculateCombinedPlan(goals) {
  const plans = goals.map((goal) => ({ goal, plan: calculateSavingsPlan(goal) }))
  const active = plans.filter(({ plan }) => plan.status !== 'met')

  const totalTargetAmount = goals.reduce((sum, g) => sum + Math.max(Number(g.targetAmount) || 0, 0), 0)
  const totalAmountSaved = goals.reduce((sum, g) => sum + Math.max(Number(g.amountSaved) || 0, 0), 0)

  if (active.length === 0) {
    return {
      activeGoalsCount: 0,
      totalGoalsCount: goals.length,
      totalTargetAmount,
      totalAmountSaved,
      totalAmountRemaining: 0,
      perDay: 0,
      perWeek: 0,
      perMonth: 0,
      perPaycheck: null,
      rows: [],
      headlineUnit: 'perWeek',
      breakdownMode: 'grid',
      daysRemaining: 0,
    }
  }

  const totalAmountRemaining = active.reduce((sum, { plan }) => sum + plan.amountRemaining, 0)
  const perDay = active.reduce((sum, { plan }) => sum + plan.perDay, 0)
  const perWeek = perDay * 7
  const perMonth = perDay * AVG_DAYS_PER_MONTH

  const payFrequencies = new Set(active.map(({ goal }) => goal.payFrequency || 'biweekly'))
  const perPaycheck = payFrequencies.size === 1
    ? active.reduce((sum, { plan }) => sum + plan.perPaycheck, 0)
    : null
  const paycheckDays = payFrequencies.size === 1
    ? PAY_FREQUENCY_DAYS[[...payFrequencies][0]] || PAY_FREQUENCY_DAYS.biweekly
    : null

  const nearestDaysRemaining = Math.min(...active.map(({ plan }) => plan.daysRemaining))

  // A period is only meaningful on the combined card if it's meaningful for
  // *every* contributing goal's own card — summing a goal's real per-period
  // rate together with another goal's "meaningless past this window" rate
  // would misrepresent the total, so an unsuppressed goal doesn't rescue a
  // suppressed one. This reuses each goal's own row.visible (from
  // calculateSavingsPlan) rather than re-deriving the rule, so it can never
  // drift from what that goal's own card shows.
  const rowVisibleForAll = (key) => active.every(({ plan }) => plan.rows.find((r) => r.key === key)?.visible)

  const rows = [
    { key: 'perDay', label: ROW_LABELS.perDay, value: perDay, visible: true },
    { key: 'perWeek', label: ROW_LABELS.perWeek, value: perWeek, visible: rowVisibleForAll('perWeek') },
    { key: 'perMonth', label: ROW_LABELS.perMonth, value: perMonth, visible: rowVisibleForAll('perMonth') },
    ...(perPaycheck != null
      ? [{ key: 'perPaycheck', label: ROW_LABELS.perPaycheck, value: perPaycheck, visible: rowVisibleForAll('perPaycheck') }]
      : []),
  ]
  const headlineUnit = pickHeadlineUnit(rows)
  const visibleNonDayRows = rows.filter((r) => r.key !== 'perDay' && r.visible)
  const breakdownMode = visibleNonDayRows.length === 0 ? 'single-line' : 'grid'

  const percentSaved = totalTargetAmount > 0
    ? Math.min((totalAmountSaved / totalTargetAmount) * 100, 100)
    : 100

  return {
    activeGoalsCount: active.length,
    totalGoalsCount: goals.length,
    totalTargetAmount,
    totalAmountSaved,
    totalAmountRemaining,
    percentSaved,
    perDay,
    perWeek,
    perMonth,
    perPaycheck,
    rows,
    headlineUnit,
    breakdownMode,
    daysRemaining: nearestDaysRemaining,
  }
}
