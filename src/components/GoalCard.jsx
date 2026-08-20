import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, ChevronDown, ChevronUp, Pencil, Sparkles, Trash2 } from 'lucide-react'
import { calculateSavingsPlan, headlineUnitWord, HIGH_INCOME_SHARE_THRESHOLD } from '../utils/calculations'
import { FillIcon } from './FillIcon'
import { JourneyProgress } from './JourneyProgress'
import { ProgressBar } from './ProgressBar'
import { RingProgress } from './RingProgress'
import { VisualizationPicker } from './VisualizationPicker'
import { CATEGORIES } from './CategoryPicker'
import { ShareGoal } from './ShareGoal'
import { TradeoffSlider } from './TradeoffSlider'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const CARD_STYLES = {
  met: 'border-cyan-200 bg-cyan-50/50',
  overdue: 'border-amber-200 bg-amber-50/40',
  'due-today': 'border-stone-200 bg-white',
  'on-track': 'border-stone-200 bg-white',
  'deadline-imminent': 'border-stone-200 bg-white',
}

function headline(plan, goal) {
  const label = goal.name?.trim() || null

  if (plan.status === 'met') return label ? `${label} — goal reached!` : 'Goal reached!'
  if (plan.status === 'due-today') {
    return label
      ? `Save ${currency.format(plan.amountRemaining)} today for ${label}`
      : `Save ${currency.format(plan.amountRemaining)} today to reach this goal`
  }
  if (plan.status === 'overdue') {
    return label
      ? `${label}: this date has passed — update your target date or add funds`
      : 'This date has passed — update your target date or add funds'
  }

  // Parse as local date components — new Date(goal.targetDate) treats a
  // "YYYY-MM-DD" string as UTC midnight, which can display a day early.
  const [year, month, day] = goal.targetDate.split('-').map(Number)
  // Only show the year when the target isn't this year — "by Aug 20" is
  // unambiguous for a same-year goal, but silently means next year (or any
  // other year) once the date crosses a Jan 1 boundary.
  const dateLabel = new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: year !== new Date().getFullYear() ? 'numeric' : undefined,
  })
  const amount = plan[plan.headlineUnit]
  const unitWord = headlineUnitWord(plan.headlineUnit)
  return label
    ? `${currency.format(amount)}/${unitWord} toward ${label} by ${dateLabel}`
    : `${currency.format(amount)}/${unitWord} to reach this by ${dateLabel}`
}

const MILESTONES = [25, 50, 75, 100]

const MILESTONE_MESSAGES = {
  25: "Nice — that's a quarter of the way there.",
  50: 'Halfway there!',
  75: 'Almost there — just one more push.',
  100: "You did it! Goal reached.",
}

// Rotates so frequent savers (e.g. every paycheck) don't see the same line
// back-to-back. Kept intentionally short — this is a subtle touch, not a
// feature to expand.
const SAVE_ACK_MESSAGES = [
  'Nice — got it added.',
  "Logged. You're getting closer.",
  'Added — nice work.',
  'Got it. Every bit counts.',
  'Saved. Onward.',
]

function incomeShareNote(plan) {
  if (plan.headlineIncomeShare == null) return null
  if (plan.exceedsFullPaycheck) return "That's more than a full paycheck each pay period."
  if (plan.headlineIncomeShare >= HIGH_INCOME_SHARE_THRESHOLD) {
    return `That's about ${plan.headlineIncomeShare.toFixed(0)}% of your take-home pay.`
  }
  return null
}

function savingsInputLabel(payFrequency) {
  if (payFrequency === 'daily') return 'Add what you saved today'
  if (payFrequency === 'weekly') return 'Add what you saved this week'
  if (payFrequency === 'monthly') return 'Add what you saved this month'
  return 'Add what you saved since your last paycheck'
}

export function GoalCard({ goal, onUpdateSaved, onUpdateGoal, onEdit, onDelete, onChangeVisualization, justCreated, onIntroComplete }) {
  const [showMore, setShowMore] = useState(false)
  const [savedInput, setSavedInput] = useState('')
  const [celebration, setCelebration] = useState(null)
  const [celebrationLeaving, setCelebrationLeaving] = useState(false)
  const [saveAck, setSaveAck] = useState(false)
  const [saveAckLeaving, setSaveAckLeaving] = useState(false)
  const [saveAckMessage, setSaveAckMessage] = useState(SAVE_ACK_MESSAGES[0])
  const [inputNotice, setInputNotice] = useState(null)
  const [inputNoticeLeaving, setInputNoticeLeaving] = useState(false)
  const [introVisible, setIntroVisible] = useState(justCreated)

  const plan = calculateSavingsPlan(goal)
  const category = CATEGORIES.find((c) => c.key === goal.category)
  const Icon = category?.icon
  const shareNote = plan.status !== 'met' ? incomeShareNote(plan) : null
  const percentLabel = `${Math.min(Math.max(plan.percentSaved, 0), 100).toFixed(0)}% saved`

  const prevPercentRef = useRef(null)
  const celebrationHideTimeoutRef = useRef(null)
  const celebrationRemoveTimeoutRef = useRef(null)
  const saveAckHideTimeoutRef = useRef(null)
  const saveAckRemoveTimeoutRef = useRef(null)
  const saveAckIndexRef = useRef(0)
  const inputNoticeHideTimeoutRef = useRef(null)
  const inputNoticeRemoveTimeoutRef = useRef(null)

  // Skip the celebration on first mount (prevPercentRef starts null) so
  // loading an already-progressed goal doesn't fire a stale milestone.
  useEffect(() => {
    const prevPercent = prevPercentRef.current
    if (prevPercent !== null) {
      const newlyCrossed = MILESTONES.filter((m) => prevPercent < m && plan.percentSaved >= m)
      if (newlyCrossed.length > 0) {
        const threshold = newlyCrossed[newlyCrossed.length - 1]
        if (celebrationHideTimeoutRef.current) clearTimeout(celebrationHideTimeoutRef.current)
        if (celebrationRemoveTimeoutRef.current) clearTimeout(celebrationRemoveTimeoutRef.current)
        // A milestone popup always wins over a lingering lightweight ack —
        // never show both at once, regardless of what triggered this.
        if (saveAckHideTimeoutRef.current) clearTimeout(saveAckHideTimeoutRef.current)
        if (saveAckRemoveTimeoutRef.current) clearTimeout(saveAckRemoveTimeoutRef.current)
        setSaveAck(false)
        setSaveAckLeaving(false)
        setCelebration({ threshold, key: Date.now() })
        setCelebrationLeaving(false)
        celebrationHideTimeoutRef.current = setTimeout(() => setCelebrationLeaving(true), 2300)
        celebrationRemoveTimeoutRef.current = setTimeout(() => setCelebration(null), 2600)
      }
    }
    prevPercentRef.current = plan.percentSaved
  }, [plan.percentSaved])

  useEffect(() => () => {
    if (celebrationHideTimeoutRef.current) clearTimeout(celebrationHideTimeoutRef.current)
    if (celebrationRemoveTimeoutRef.current) clearTimeout(celebrationRemoveTimeoutRef.current)
    if (saveAckHideTimeoutRef.current) clearTimeout(saveAckHideTimeoutRef.current)
    if (saveAckRemoveTimeoutRef.current) clearTimeout(saveAckRemoveTimeoutRef.current)
    if (inputNoticeHideTimeoutRef.current) clearTimeout(inputNoticeHideTimeoutRef.current)
    if (inputNoticeRemoveTimeoutRef.current) clearTimeout(inputNoticeRemoveTimeoutRef.current)
  }, [])

  const onIntroCompleteRef = useRef(onIntroComplete)
  onIntroCompleteRef.current = onIntroComplete

  useEffect(() => {
    if (!justCreated) return
    const t = setTimeout(() => {
      setIntroVisible(false)
      onIntroCompleteRef.current?.()
    }, 1500)
    return () => clearTimeout(t)
  }, [justCreated])

  // Hard-dismiss (no fade) each message type so a new action never renders
  // alongside one still fading out from a previous action — only one of
  // celebration / saveAck / inputNotice should ever be visible at a time.
  function dismissCelebration() {
    if (celebrationHideTimeoutRef.current) clearTimeout(celebrationHideTimeoutRef.current)
    if (celebrationRemoveTimeoutRef.current) clearTimeout(celebrationRemoveTimeoutRef.current)
    setCelebration(null)
    setCelebrationLeaving(false)
  }

  function dismissSaveAck() {
    if (saveAckHideTimeoutRef.current) clearTimeout(saveAckHideTimeoutRef.current)
    if (saveAckRemoveTimeoutRef.current) clearTimeout(saveAckRemoveTimeoutRef.current)
    setSaveAck(false)
    setSaveAckLeaving(false)
  }

  function dismissInputNotice() {
    if (inputNoticeHideTimeoutRef.current) clearTimeout(inputNoticeHideTimeoutRef.current)
    if (inputNoticeRemoveTimeoutRef.current) clearTimeout(inputNoticeRemoveTimeoutRef.current)
    setInputNotice(null)
    setInputNoticeLeaving(false)
  }

  function showInputNotice(message) {
    dismissInputNotice()
    setInputNotice(message)
    inputNoticeHideTimeoutRef.current = setTimeout(() => setInputNoticeLeaving(true), 1900)
    inputNoticeRemoveTimeoutRef.current = setTimeout(() => setInputNotice(null), 2200)
  }

  function handleSavedInputChange(e) {
    setSavedInput(e.target.value)
    // Typing toward the next entry means the previous ack/notice no longer
    // applies to what's on screen — clear it rather than let it linger.
    dismissSaveAck()
    dismissInputNotice()
  }

  function handleUpdateSaved(e) {
    e.preventDefault()

    // A new Add action always replaces whatever message is currently
    // showing (or fading out), rather than letting the two overlap.
    dismissCelebration()
    dismissSaveAck()
    dismissInputNotice()

    const trimmed = savedInput.trim()
    if (trimmed === '') {
      showInputNotice('Add an amount to log it.')
      return
    }
    const delta = Math.round(Number(trimmed) * 100) / 100
    if (Number.isNaN(delta)) return
    if (delta === 0) {
      setSavedInput('')
      showInputNotice("That's a $0 update — nothing to add yet!")
      return
    }
    const newAmountSaved = Math.max(0, goal.amountSaved + delta)
    onUpdateSaved(goal.id, newAmountSaved)
    setSavedInput('')

    // The full milestone popup (see the effect above) already covers the
    // case where this save crosses a threshold — only show the lightweight
    // ack when it doesn't, so the two never compete for attention.
    const newPercent = goal.targetAmount > 0 ? (newAmountSaved / goal.targetAmount) * 100 : 0
    const crossesMilestone = MILESTONES.some((m) => plan.percentSaved < m && newPercent >= m)
    if (!crossesMilestone) {
      setSaveAckMessage(SAVE_ACK_MESSAGES[saveAckIndexRef.current % SAVE_ACK_MESSAGES.length])
      saveAckIndexRef.current += 1
      setSaveAck(true)
      setSaveAckLeaving(false)
      saveAckHideTimeoutRef.current = setTimeout(() => setSaveAckLeaving(true), 1400)
      saveAckRemoveTimeoutRef.current = setTimeout(() => setSaveAck(false), 1700)
    }
  }

  function handleDelete() {
    if (window.confirm('Delete this savings goal? This can’t be undone.')) {
      onDelete(goal.id)
    }
  }

  return (
    <div
      className={`@container flex flex-col gap-4 rounded-xl border p-6 shadow-sm transition-colors ${
        CARD_STYLES[plan.status] ?? CARD_STYLES['on-track']
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 text-sm text-stone-500">
          {Icon && <Icon size={16} className="shrink-0" />}
          <span className="truncate">{goal.name || 'Savings goal'}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(goal.id)}
            aria-label="Edit goal"
            className="rounded-md p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            aria-label="Delete goal"
            className="rounded-md p-1.5 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="relative">
        <p
          className={`flex items-center gap-2 font-heading text-2xl font-semibold transition-opacity duration-500 ${
            plan.status === 'met' ? 'text-cyan-700' : 'text-stone-900'
          } ${introVisible ? 'opacity-0' : 'opacity-100'}`}
        >
          {plan.status === 'met' && <CheckCircle2 size={24} className="shrink-0 text-cyan-600" />}
          {headline(plan, goal)}
        </p>
        {introVisible && (
          <p className="absolute inset-0 animate-fade-in-up font-heading text-2xl font-semibold text-cyan-600">
            Here's your plan
          </p>
        )}
      </div>

      {shareNote && <p className="-mt-2 text-sm text-stone-500">{shareNote}</p>}

      <div className="flex flex-col items-center gap-1 py-1">
        {/* Celebration badge overlaps only the icon/graphic, not the "% saved"
            text below it — centering it on the whole column (icon + text)
            used to sit right on top of that text for a couple of seconds. */}
        <div className="relative flex w-full items-center justify-center">
          {celebration && (
            <div
              className={`absolute left-1/2 top-1/2 z-10 flex w-max -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-lg bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-700 shadow-sm ring-1 ring-cyan-100 transition-opacity duration-300 ease-in ${
                celebrationLeaving ? 'opacity-0' : 'animate-fade-in-up opacity-100'
              }`}
            >
              <Sparkles size={14} className="shrink-0" />
              {MILESTONE_MESSAGES[celebration.threshold]}
            </div>
          )}
          {goal.visualizationStyle === 'bar' && <ProgressBar percent={plan.percentSaved} showLabel={false} />}
          {goal.visualizationStyle === 'ring' && <RingProgress percent={plan.percentSaved} />}
          {goal.visualizationStyle === 'journey' && (
            <JourneyProgress icon={Icon} percent={plan.percentSaved} celebrating={!!celebration} />
          )}
          {(!goal.visualizationStyle || goal.visualizationStyle === 'fill') && (
            <FillIcon
              emoji={goal.emoji || category?.emojiOptions?.[0]}
              label={category?.label}
              percent={plan.percentSaved}
              celebrating={!!celebration}
            />
          )}
        </div>
        {goal.visualizationStyle !== 'ring' && (
          <p className="text-xs text-stone-500">{percentLabel}</p>
        )}
        {onChangeVisualization && (
          <VisualizationPicker
            value={goal.visualizationStyle}
            onChange={(style) => onChangeVisualization(goal.id, style)}
          />
        )}
      </div>

      <p className="text-sm text-stone-500">
        {currency.format(Math.min(goal.amountSaved, goal.targetAmount))} of {currency.format(goal.targetAmount)} saved
      </p>

      {plan.status === 'met' && <ShareGoal goal={goal} />}

      {plan.status !== 'met' && (
        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="flex items-center gap-1 self-start text-sm font-medium text-cyan-700 hover:text-cyan-800"
        >
          {showMore ? 'Show less' : 'Show more'}
          {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}

      {showMore && plan.status !== 'met' && plan.breakdownMode === 'single-line' && (
        <p className="rounded-lg bg-stone-50 p-4 text-sm text-stone-600">
          {plan.daysRemaining > 0
            ? `${currency.format(plan.amountRemaining)} left, with ${plan.daysRemaining} day${plan.daysRemaining === 1 ? '' : 's'} to go.`
            : `${currency.format(plan.amountRemaining)} left to save.`}
        </p>
      )}

      {showMore && plan.status !== 'met' && plan.breakdownMode === 'grid' && (
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-stone-50 p-4 text-sm @sm:grid-cols-4">
          {plan.rows.filter((row) => row.visible).map((row) => (
            <div key={row.key}>
              <p className="text-stone-500">{row.label}</p>
              <p className="font-semibold text-stone-900">{currency.format(row.value)}</p>
            </div>
          ))}
        </div>
      )}

      {showMore && plan.status !== 'met' && plan.status !== 'overdue' && (
        <TradeoffSlider
          goal={goal}
          plan={plan}
          onApplyRate={onUpdateGoal ? (targetDate) => onUpdateGoal(goal.id, { targetDate }) : undefined}
        />
      )}

      {plan.status !== 'met' && (
        <form onSubmit={handleUpdateSaved} className="flex items-end gap-2 border-t border-stone-100 pt-4">
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="savedAmount" className="text-sm font-medium text-stone-700">
              {savingsInputLabel(goal.payFrequency)}
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">$</span>
              <input
                id="savedAmount"
                type="number"
                inputMode="decimal"
                step="any"
                value={savedInput}
                onChange={handleSavedInputChange}
                placeholder="0"
                className="w-full rounded-lg border border-stone-300 py-2 pl-7 pr-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
          >
            Add
          </button>
        </form>
      )}

      {saveAck && (
        <p
          className={`-mt-2 flex items-center gap-1 text-xs font-medium text-cyan-600 transition-opacity duration-300 ease-in ${
            saveAckLeaving ? 'opacity-0' : 'animate-fade-in-up opacity-100'
          }`}
        >
          <CheckCircle2 size={12} className="shrink-0" />
          {saveAckMessage}
        </p>
      )}

      {inputNotice && (
        <p
          className={`-mt-2 text-xs font-medium text-stone-500 transition-opacity duration-300 ease-in ${
            inputNoticeLeaving ? 'opacity-0' : 'animate-fade-in-up opacity-100'
          }`}
        >
          {inputNotice}
        </p>
      )}
    </div>
  )
}
