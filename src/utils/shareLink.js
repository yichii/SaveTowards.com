const SHARE_VERSION = 1

// btoa/atob only handle Latin1 — round-trip through encodeURIComponent so
// goal names with emoji/unicode survive. base64url (-/_ , no padding) so the
// result is safe to drop straight into a URL hash with no extra escaping.
function encodeBase64Url(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function decodeBase64Url(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
  return decodeURIComponent(escape(atob(padded)))
}

// lastUpdatedAt is bumped on every "add what you saved" edit, including the
// one that pushed the goal over 100% — so at completion it's a stand-in for
// "the day this goal was finished" without needing a dedicated field.
export function computeDaysToSave(goal) {
  if (!goal.createdAt || !goal.lastUpdatedAt) return null
  const days = Math.round((new Date(goal.lastUpdatedAt) - new Date(goal.createdAt)) / 86400000)
  return days >= 0 ? days : null
}

// Only what a shared card needs to render: name, amounts, date, category,
// icon, and a derived day-count. No id, no raw timestamps, no pay frequency —
// those never leave the device.
function buildPayload(goal, includeAmounts) {
  const payload = {
    v: SHARE_VERSION,
    n: goal.name || '',
    c: goal.category || '',
    e: goal.emoji || '',
  }
  if (includeAmounts) {
    payload.t = goal.targetAmount
    payload.s = goal.amountSaved
    payload.d = goal.targetDate
    const days = computeDaysToSave(goal)
    if (days !== null) payload.p = days
  }
  return payload
}

export function buildShareHash(goal, includeAmounts) {
  return `s=${encodeBase64Url(JSON.stringify(buildPayload(goal, includeAmounts)))}`
}

export function buildShareUrl(goal, includeAmounts) {
  const base = `${window.location.origin}${window.location.pathname}${window.location.search}`
  return `${base}#${buildShareHash(goal, includeAmounts)}`
}

function isValidPayload(data) {
  if (!data || typeof data !== 'object') return false
  if (data.v !== SHARE_VERSION) return false
  if (typeof data.n !== 'string') return false
  if (data.c !== undefined && typeof data.c !== 'string') return false
  if (data.e !== undefined && typeof data.e !== 'string') return false

  const hasAmounts = data.t !== undefined
  if (hasAmounts && (typeof data.t !== 'number' || typeof data.s !== 'number' || typeof data.d !== 'string')) {
    return false
  }
  if (data.p !== undefined && (typeof data.p !== 'number' || data.p < 0)) return false
  return true
}

// Reads a `#s=<encoded>` payload from a location.hash string. Returns null on
// anything missing/malformed/invalid — callers fall through to the normal
// dashboard silently rather than showing an error.
export function decodeSharePayload(hash) {
  if (!hash || hash.length < 2) return null

  const encoded = new URLSearchParams(hash.slice(1)).get('s')
  if (!encoded) return null

  let data
  try {
    data = JSON.parse(decodeBase64Url(encoded))
  } catch {
    return null
  }
  if (!isValidPayload(data)) return null

  const includeAmounts = data.t !== undefined
  return {
    name: data.n,
    category: data.c || '',
    emoji: data.e || '',
    includeAmounts,
    targetAmount: includeAmounts ? data.t : undefined,
    amountSaved: includeAmounts ? data.s : undefined,
    targetDate: includeAmounts ? data.d : undefined,
    daysToSave: includeAmounts ? (data.p ?? null) : null,
  }
}

// "in 6 days" / "in 3 weeks" / "in 4 months" — coarser as the duration grows
// so the number reads naturally instead of "in 47 days".
export function formatDuration(days) {
  if (days <= 0) return 'in less than a day'
  if (days < 21) return `in ${days} day${days === 1 ? '' : 's'}`
  if (days < 90) {
    const weeks = Math.max(1, Math.round(days / 7))
    return `in ${weeks} week${weeks === 1 ? '' : 's'}`
  }
  const months = Math.max(1, Math.round(days / 30.44))
  return `in ${months} month${months === 1 ? '' : 's'}`
}
