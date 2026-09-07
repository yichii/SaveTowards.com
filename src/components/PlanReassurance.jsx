import { LifeBuoy, TrendingUp } from 'lucide-react'
import { headlineUnitWord } from '../utils/calculations'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const TONE_STYLES = {
  steady: 'bg-emerald-100 text-emerald-900/70',
  ahead: 'bg-emerald-50 text-emerald-800',
}

// The compassionate layer over a goal card. It names the moments where a
// plan stops feeling effortless — you've slipped behind the pace it set
// out with, or the timeline is asking more than a whole paycheck — and
// always hands you a way forward instead of just flagging it. It also
// gives an unprompted nod when you're ahead. Returns null when the plan
// needs no comment.
export function PlanReassurance({ plan, onGiveMoreTime }) {
  const unitWord = headlineUnitWord(plan.headlineUnit)
  const headlineAmount = currency.format(plan[plan.headlineUnit])

  if (plan.exceedsFullPaycheck) {
    return (
      <Note tone="steady" icon={LifeBuoy} action="Give this goal more time" onAction={onGiveMoreTime}>
        This timeline is asking more than a whole paycheck each time you&apos;re paid — that&apos;s a lot
        to hold up. Pushing the date out even a little brings the number back down to something steadier.
      </Note>
    )
  }

  if (plan.pace?.state === 'behind') {
    return (
      <Note tone="steady" icon={LifeBuoy} action="Give this goal more time" onAction={onGiveMoreTime}>
        Life gets in the way sometimes, and this goal has slipped a little behind its own pace — which
        is completely normal. Saving about {headlineAmount}/{unitWord} from here still gets you there on
        time. If that&apos;s steeper than it should be, give yourself more room.
      </Note>
    )
  }

  if (plan.pace?.state === 'ahead') {
    return (
      <Note tone="ahead" icon={TrendingUp}>
        You&apos;re ahead of where this goal expected you to be. Keep this up and you&apos;ll get there
        early.
      </Note>
    )
  }

  return null
}

function Note({ tone, icon: Icon, children, action, onAction }) {
  return (
    <div className={`flex flex-col gap-2 rounded-lg p-4 text-sm ${TONE_STYLES[tone]}`}>
      <p className="flex gap-2">
        <Icon size={16} className="mt-0.5 shrink-0" />
        <span>{children}</span>
      </p>
      {action && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="self-start rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-emerald-900 shadow-sm transition-colors hover:bg-emerald-50"
        >
          {action}
        </button>
      )}
    </div>
  )
}
