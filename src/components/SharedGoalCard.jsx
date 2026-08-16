import { PartyPopper } from 'lucide-react'
import { FillIcon } from './FillIcon'
import { CATEGORIES } from './CategoryPicker'
import { formatDuration } from '../utils/shareLink'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

// Read-only celebration card — the exact thing a share link renders, reused
// both for the sender's "here's what they'll see" preview and the
// recipient's full-page view, so the two can never drift apart.
export function SharedGoalCard({ name, category, emoji, includeAmounts, targetAmount, amountSaved, daysToSave }) {
  const cat = CATEGORIES.find((c) => c.key === category)
  const label = name?.trim() || 'This goal'
  const glyph = emoji || cat?.emojiOptions?.[0]

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-cyan-200 bg-cyan-50/50 p-6 text-center shadow-sm">
      <FillIcon emoji={glyph} label={cat?.label} percent={100} size={72} />
      <p className="flex items-center gap-1.5 font-heading text-xl font-semibold text-cyan-700">
        <PartyPopper size={20} className="shrink-0" />
        {label} — goal reached!
      </p>
      {includeAmounts ? (
        <div className="flex flex-col gap-0.5">
          <p className="text-sm text-stone-600">{currency.format(amountSaved)} saved</p>
          {daysToSave != null && (
            <p className="text-xs text-stone-500">Saved {formatDuration(daysToSave)}</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-stone-600">100% saved</p>
      )}
    </div>
  )
}
