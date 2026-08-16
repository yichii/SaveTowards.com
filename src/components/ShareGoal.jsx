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
        className="flex items-center gap-1.5 self-center rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-sm font-medium text-cyan-700 transition-colors hover:bg-cyan-100"
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
    <div className="flex flex-col gap-3 rounded-xl border border-cyan-200 bg-cyan-50/40 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-stone-700">Share this goal</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="rounded-md p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
        >
          <X size={16} />
        </button>
      </div>

      <p className="text-xs text-stone-500">This is exactly what your recipient will see. Anyone with the link can view it.</p>

      <SharedGoalCard
        name={goal.name}
        category={goal.category}
        emoji={goal.emoji}
        includeAmounts={includeAmounts}
        targetAmount={goal.targetAmount}
        amountSaved={goal.amountSaved}
        daysToSave={includeAmounts ? computeDaysToSave(goal) : null}
      />

      <label className="flex items-center justify-between gap-2 text-sm text-stone-700">
        <span>Share without dollar amounts</span>
        <input
          type="checkbox"
          checked={!includeAmounts}
          onChange={(e) => setIncludeAmounts(!e.target.checked)}
          className="h-4 w-4 rounded border-stone-300 text-cyan-600 focus:ring-cyan-500"
        />
      </label>

      <div className="flex items-center gap-2">
        <input
          readOnly
          value={link}
          onFocus={(e) => e.target.select()}
          aria-label="Share link"
          className="w-0 flex-1 truncate rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs text-stone-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-700"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
    </div>
  )
}
