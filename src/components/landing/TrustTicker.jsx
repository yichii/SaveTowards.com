import { useLayoutEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const MESSAGES = [
  'No accounts. No bank link. No risk.',
  'Your money stays where it already is.',
  'Your data. Your call.',
  'Every update is one you choose to make.',
]

export function TrustTicker() {
  const reducedMotion = usePrefersReducedMotion()
  const containerRef = useRef(null)
  const measureRef = useRef(null)
  const [repeatCount, setRepeatCount] = useState(6)

  useLayoutEffect(() => {
    if (reducedMotion) return

    const measure = () => {
      const setWidth = measureRef.current?.offsetWidth
      const containerWidth = containerRef.current?.offsetWidth
      if (!setWidth || !containerWidth) return
      // Track is split into two equal halves that scroll seamlessly, so each
      // half must alone be at least as wide as the container - otherwise the
      // scroll runs past the end of the content before the loop resets.
      const copiesPerHalf = Math.ceil(containerWidth / setWidth) + 1
      setRepeatCount(Math.max(2, copiesPerHalf * 2))
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [reducedMotion])

  if (reducedMotion) {
    return (
      <div className="shrink-0 border-t border-stone-100 py-[clamp(0.5rem,1.2dvh,1rem)]">
        <p className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 text-center text-sm text-stone-500">
          {MESSAGES.map((message) => (
            <span key={message}>{message}</span>
          ))}
        </p>
      </div>
    )
  }

  const track = Array.from({ length: repeatCount }, () => MESSAGES).flat()

  return (
    <div className="shrink-0 border-t border-stone-100 py-[clamp(0.5rem,1.2dvh,1rem)]">
      <div ref={containerRef} className="relative overflow-hidden" aria-hidden="true">
        <div
          ref={measureRef}
          className="invisible absolute flex w-max items-center whitespace-nowrap"
        >
          {MESSAGES.map((message, i) => (
            <span key={i} className="mx-6 text-sm">
              {message}
            </span>
          ))}
        </div>
        <div
          className="flex w-max animate-marquee items-center whitespace-nowrap"
          style={{ '--marquee-end': `-${100 / repeatCount}%` }}
        >
          {track.map((message, i) => (
            <span key={i} className="mx-6 text-sm text-stone-500">
              {message}
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only">{MESSAGES.join('. ')}</p>
    </div>
  )
}
