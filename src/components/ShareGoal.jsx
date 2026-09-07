import { useState } from 'react'
import { Check, Copy, Share2, X } from 'lucide-react'
import { SharedGoalCard } from './SharedGoalCard'
import { buildShareUrl, computeDaysToSave } from '../utils/shareLink'

// Share control for a goal that's hit 100%. Nothing here touches localStorage
// or the network — the link is generated client-side and copied to the
// clipboard, that's the whole feature.
export function ShareGoal({ goal }) {
  const [open, setOpen] = useState(false)
  const [includeAmounts, setIncludeAmounts] = useState(true)
  const [copied, setCopied] = useState(false)

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 self-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
      >
        <Share2 size={15} />
        Share
      </button>
    )
  }

  const link = buildShareUrl(goal, includeAmounts)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable/denied — the link is still visible and
      // selectable in the field below, so this fails silently.
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-emerald-900">Share this goal</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="rounded-md p-1 text-emerald-900/45 transition-colors hover:bg-emerald-100 hover:text-emerald-900"
        >
          <X size={16} />
        </button>
      </div>

      <p className="text-xs text-emerald-900/55">This is exactly what your recipient will see. Anyone with the link can view it.</p>

      <SharedGoalCard
        name={goal.name}
        category={goal.category}
        emoji={goal.emoji}
        includeAmounts={includeAmounts}
        targetAmount={goal.targetAmount}
        amountSaved={goal.amountSaved}
        daysToSave={includeAmounts ? computeDaysToSave(goal) : null}
      />

      <label className="flex items-center justify-between gap-2 text-sm text-emerald-900">
        <span>Share without dollar amounts</span>
        <input
          type="checkbox"
          checked={!includeAmounts}
          onChange={(e) => setIncludeAmounts(!e.target.checked)}
          className="h-4 w-4 rounded border-emerald-900/20 text-emerald-700 focus:ring-emerald-600"
        />
      </label>

      <div className="flex items-center gap-2">
        <input
          readOnly
          value={link}
          onFocus={(e) => e.target.select()}
          aria-label="Share link"
          className="w-0 flex-1 truncate rounded-lg border border-emerald-900/20 bg-white px-3 py-2 text-xs text-emerald-900/55 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
    </div>
  )
}
