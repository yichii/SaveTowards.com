import { calculateSavingsPlan } from './calculations'

// Missing/invalid createdAt (goals saved before this field existed, edge
// cases in imported data) sorts as if it were the oldest possible goal,
// rather than crashing or floating unpredictably to either end.
function createdAtValue(goal) {
  const t = Date.parse(goal.createdAt)
  return Number.isFinite(t) ? t : 0
}

// Missing/invalid targetDate sorts to the very end of "soonest first" —
// there's no real due date to rank it by, so it shouldn't crowd out goals
// that do have one.
function dueDateValue(goal) {
  const t = Date.parse(goal.targetDate)
  return Number.isFinite(t) ? t : Infinity
}

const SORT_VALUES = {
  recent: createdAtValue,
  dueDate: dueDateValue,
  amount: (goal) => Number(goal.targetAmount) || 0,
  progress: (goal) => calculateSavingsPlan(goal).percentSaved,
}

export const SORT_OPTIONS = [
  { key: 'recent', label: 'Recently Added', defaultDirection: 'desc' },
  { key: 'dueDate', label: 'Due Date', defaultDirection: 'asc' },
  { key: 'amount', label: 'Amount', defaultDirection: 'desc' },
  { key: 'progress', label: 'Progress', defaultDirection: 'desc' },
]

export function defaultDirectionFor(sortType) {
  return SORT_OPTIONS.find((o) => o.key === sortType)?.defaultDirection ?? 'desc'
}

// Array.prototype.sort has been stable (ties keep their original relative
// order) since ES2019 in every evergreen engine, so goals tied on the sort
// field stay put across re-renders instead of jumping around — no manual
// tiebreaker needed as long as the input array's own order stays stable.
export function sortGoals(goals, sortType, direction) {
  const getValue = SORT_VALUES[sortType]
  if (!getValue) return goals
  const sign = direction === 'asc' ? 1 : -1
  return [...goals].sort((a, b) => sign * (getValue(a) - getValue(b)))
}
