import { useEffect, useRef, useState } from 'react'
import { KeyRound, Landmark, Sofa, Truck } from 'lucide-react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { calculateSavingsPlan } from '../../utils/calculations'

export const EXAMPLE_GOALS = [
  { phrase: 'my down payment?', label: 'My Down Payment? · $25,000', icon: Landmark, emoji: '🏡', amount: 25000, weeks: 78, pct: 45 },
  { phrase: 'moving day?', label: 'Moving Day? · $3,000', icon: Truck, emoji: '📦', amount: 3000, weeks: 16, pct: 65 },
  { phrase: 'my first apartment?', label: 'My First Apartment? · $4,500', icon: KeyRound, emoji: '🔑', amount: 4500, weeks: 16, pct: 50 },
  { phrase: 'furnishing a home?', label: 'Furnishing a Home? · $16,000', icon: Sofa, emoji: '🛋️', amount: 16000, weeks: 52, pct: 20 },
]

// Demoted secondary examples — folded into a small, low-emphasis line rather
// than cycled through the main headline/demo-card animation.
export const SECONDARY_EXAMPLES = 'a car, a wedding, a trip'

const DELETE_MS_PER_CHAR = 30
const TYPE_MS_PER_CHAR = 55
const FILL_MS = 900
const HOLD_MS = 2200
const RESUME_AFTER_MS = 4000

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function targetDateWeeksOut(weeks) {
  const d = new Date()
  d.setDate(d.getDate() + weeks * 7)
  return d.toISOString().slice(0, 10)
}

const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

function formatTargetDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return dateFormatter.format(new Date(year, month - 1, day))
}

/**
 * Drives the hero: a shared example-goal array types/deletes the headline
 * phrase, swaps the headline icon, and fills the demo card all on the same
 * cycle. While the user is touching the slider — held still or dragging —
 * autoplay pauses; the RESUME_AFTER_MS inactivity countdown only starts
 * once they release it, then autoplay resumes (restarting the cycle from
 * the first goal).
 */
export function useHeroDemo() {
  const reducedMotion = usePrefersReducedMotion()
  const [goalIndex, setGoalIndex] = useState(0)
  const [typed, setTyped] = useState(() => (reducedMotion ? EXAMPLE_GOALS[0].phrase : ''))
  const [iconKey, setIconKey] = useState(0)
  const [percent, setPercent] = useState(() => (reducedMotion ? EXAMPLE_GOALS[0].pct : 0))
  const [manual, setManual] = useState(false)
  const resumeTimeoutRef = useRef(null)

  useEffect(() => {
    if (manual || reducedMotion) return

    let cancelled = false
    let rafId = null

    function animateFillTo(target) {
      const start = performance.now()
      function tick(now) {
        if (cancelled) return
        const t = Math.min((now - start) / FILL_MS, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        setPercent(Math.round(target * eased))
        if (t < 1) rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)
    }

    async function run() {
      let index = 0
      let currentPhrase = ''

      while (!cancelled) {
        // Backspace whatever's currently typed (no-op on the very first pass).
        for (let len = currentPhrase.length; len >= 0; len--) {
          if (cancelled) return
          setTyped(currentPhrase.slice(0, len))
          if (len > 0) await wait(DELETE_MS_PER_CHAR)
        }
        if (cancelled) return

        // Icon swap + card reset land in the gap between deleting and typing.
        const goal = EXAMPLE_GOALS[index]
        setGoalIndex(index)
        setIconKey((k) => k + 1)
        setPercent(0)
        animateFillTo(goal.pct)

        for (let len = 1; len <= goal.phrase.length; len++) {
          if (cancelled) return
          setTyped(goal.phrase.slice(0, len))
          await wait(TYPE_MS_PER_CHAR)
        }
        if (cancelled) return

        currentPhrase = goal.phrase
        await wait(HOLD_MS)
        if (cancelled) return
        index = (index + 1) % EXAMPLE_GOALS.length
      }
    }

    run()

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
    }
  }, [manual, reducedMotion])

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    }
  }, [])

  function clearResumeTimer() {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
      resumeTimeoutRef.current = null
    }
  }

  // Only counts as "inactive" once the slider is released — holding it
  // still, with no change events firing, shouldn't trigger a resume.
  function scheduleResume() {
    clearResumeTimer()
    resumeTimeoutRef.current = setTimeout(() => setManual(false), RESUME_AFTER_MS)
  }

  function stopAutoplay() {
    setManual(true)
    setTyped(EXAMPLE_GOALS[goalIndex].phrase)
    clearResumeTimer()
  }

  function handleSliderChange(value) {
    setManual(true)
    setPercent(value)
    clearResumeTimer()
  }

  function handleSliderRelease() {
    scheduleResume()
  }

  const goal = EXAMPLE_GOALS[goalIndex]
  const amountSaved = Math.round((percent / 100) * goal.amount)
  const targetDate = targetDateWeeksOut(goal.weeks)
  const plan = calculateSavingsPlan({
    targetAmount: goal.amount,
    amountSaved,
    targetDate,
    payFrequency: 'weekly',
  })
  const targetDateLabel = formatTargetDate(targetDate)

  return {
    goal,
    typed,
    iconKey,
    percent,
    plan,
    targetDateLabel,
    isAutoplay: !manual && !reducedMotion,
    onSliderPointerDown: stopAutoplay,
    onSliderChange: handleSliderChange,
    onSliderRelease: handleSliderRelease,
  }
}
