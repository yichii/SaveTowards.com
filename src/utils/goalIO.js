import { isValidTargetDateString } from './dateValidation'

const EXPORT_VERSION = 1

export function exportGoals(goals) {
  const payload = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    goals,
  }

  const dateStr = new Date().toISOString().slice(0, 10)
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `savetowards-goals-${dateStr}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function isValidGoal(goal) {
  return (
    goal &&
    typeof goal === 'object' &&
    typeof goal.id === 'string' &&
    goal.id.length > 0 &&
    typeof goal.targetAmount === 'number' &&
    Number.isFinite(goal.targetAmount) &&
    goal.targetAmount >= 0 &&
    typeof goal.amountSaved === 'number' &&
    Number.isFinite(goal.amountSaved) &&
    goal.amountSaved >= 0 &&
    isValidTargetDateString(goal.targetDate)
  )
}

// Throws a user-facing Error with a friendly message on any validation failure.
export function parseImportPayload(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('That file isn’t valid JSON.')
  }

  if (!data || typeof data !== 'object' || !Array.isArray(data.goals)) {
    throw new Error('That file doesn’t look like a SaveTowards export.')
  }

  if (data.goals.length === 0) {
    throw new Error('That file doesn’t contain any goals.')
  }

  if (!data.goals.every(isValidGoal)) {
    throw new Error('Some goals in that file are missing required info.')
  }

  return data.goals
}

// Merges imported goals into existing goals, matched by id. Existing goals are
// kept; new ids are added. On a matching id, whichever copy has the more
// recent lastUpdatedAt wins.
export function mergeGoals(existingGoals, importedGoals) {
  const now = new Date().toISOString()
  const existingById = new Map(existingGoals.map((g) => [g.id, g]))
  const merged = [...existingGoals]
  let added = 0
  let alreadyPresent = 0

  for (const raw of importedGoals) {
    const incoming = {
      ...raw,
      createdAt: raw.createdAt ?? now,
      lastUpdatedAt: raw.lastUpdatedAt ?? now,
    }
    const existing = existingById.get(incoming.id)

    if (!existing) {
      merged.push(incoming)
      added += 1
      continue
    }

    alreadyPresent += 1
    const existingUpdated = existing.lastUpdatedAt ?? existing.createdAt ?? ''
    if (incoming.lastUpdatedAt > existingUpdated) {
      const index = merged.findIndex((g) => g.id === existing.id)
      merged[index] = incoming
    }
  }

  return { merged, added, alreadyPresent }
}
