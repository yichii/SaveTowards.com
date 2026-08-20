// Sanity bound for target dates — large enough to cover any real savings
// goal, small enough to catch typos (e.g. an extra digit in the year) before
// they silently produce a "$0.00/period" plan.
export const MAX_YEARS_OUT = 100

// Strictly validates a "YYYY-MM-DD" target date string: correct shape, a
// real calendar date (Date rolls invalid components like Feb 30 forward
// instead of erroring, so round-tripping catches those), and within the
// sanity bound above. Used by both goal creation and import, so a stray
// full ISO datetime or an absurd year is rejected the same way everywhere.
export function isValidTargetDateString(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return false
  }

  return year <= new Date().getFullYear() + MAX_YEARS_OUT
}

// "YYYY-MM-DD" for the date input's `max` attribute, so the native picker
// itself doesn't offer dates beyond the sanity bound.
export function maxTargetDateIso(fromDate = new Date()) {
  const max = new Date(fromDate.getFullYear() + MAX_YEARS_OUT, fromDate.getMonth(), fromDate.getDate())
  const year = max.getFullYear()
  const month = String(max.getMonth() + 1).padStart(2, '0')
  const day = String(max.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
