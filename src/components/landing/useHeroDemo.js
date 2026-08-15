import { useEffect, useRef, useState } from 'react'
import { Plane, Car, Heart } from 'lucide-react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { calculateSavingsPlan } from '../../utils/calculations'

export const EXAMPLE_GOALS = [
  { label: 'Trip to Japan · $2,400', icon: Plane, amount: 2400, weeks: 12, pct: 35 },
  { label: 'New car · $6,000', icon: Car, amount: 6000, weeks: 20, pct: 18 },
  { label: 'Wedding fund · $15,000', icon: Heart, amount: 15000, weeks: 40, pct: 62 },
]

const FILL_MS = 900
const CYCLE_MS = 3800

function targetDateWeeksOut(weeks) {
  const d = new Date()
  d.setDate(d.getDate() + weeks * 7)
  return d.toISOString().slice(0, 10)
}

/**
 * Drives the hero demo card: autoplays through EXAMPLE_GOALS with a 0→target
 * fill animation until the user first touches the slider, then hands full
 * control over permanently — no snap-back, no resuming autoplay.
 */
export function useHeroDemo() {
  const reducedMotion = usePrefersReducedMotion()
  const [goalIndex, setGoalIndex] = useState(0)
  const [percent, setPercent] = useState(() => (reducedMotion ? EXAMPLE_GOALS[0].pct : 0))
  const [manual, setManual] = useState(false)
  const [cycleKey, setCycleKey] = useState(0)

  const rafRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (manual || reducedMotion) return

    let cancelled = false

    function runCycle(index) {
      setGoalIndex(index)
      setPercent(0)
      setCycleKey((k) => k + 1)
      const target = EXAMPLE_GOALS[index].pct
      const start = performance.now()

      function tick(now) {
        if (cancelled) return
        const t = Math.min((now - start) / FILL_MS, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        setPercent(Math.round(target * eased))
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          timeoutRef.current = setTimeout(() => {
            if (!cancelled) runCycle((index + 1) % EXAMPLE_GOALS.length)
          }, CYCLE_MS - FILL_MS)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    runCycle(0)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafRef.current)
      clearTimeout(timeoutRef.current)
    }
  }, [manual, reducedMotion])

  function stopAutoplay() {
    setManual((wasManual) => {
      if (!wasManual) {
        cancelAnimationFrame(rafRef.current)
        clearTimeout(timeoutRef.current)
      }
      return true
    })
  }

  function handleSliderChange(value) {
    stopAutoplay()
    setPercent(value)
  }

  const goal = EXAMPLE_GOALS[goalIndex]
  const amountSaved = Math.round((percent / 100) * goal.amount)
  const plan = calculateSavingsPlan({
    targetAmount: goal.amount,
    amountSaved,
    targetDate: targetDateWeeksOut(goal.weeks),
    payFrequency: 'weekly',
  })
  const monthsRemaining = Math.max(Math.round(goal.weeks / 4.345), 1)

  return {
    goal,
    percent,
    plan,
    monthsRemaining,
    isAutoplay: !manual && !reducedMotion,
    cycleKey,
    onSliderPointerDown: stopAutoplay,
    onSliderChange: handleSliderChange,
  }
}
