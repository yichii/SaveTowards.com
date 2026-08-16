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
    }
  }

  // Target date has already passed or is today: no time left to spread
  // contributions over, so the honest number is "save the rest now" — every
  // wider window necessarily exceeds the time left too.
  const perDay = daysRemaining > 0 ? amountRemaining / daysRemaining : amountRemaining
  const perWeek = perDay * 7
  const perMonth = perDay * AVG_DAYS_PER_MONTH
  const perPaycheck = perDay * paycheckDays

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
  }
}

export function headlineUnitWord(unit) {
  return UNIT_WORDS[unit] ?? 'week'
}
