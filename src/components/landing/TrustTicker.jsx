import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const MESSAGES = [
  'No accounts. No bank link. Nothing to steal.',
  'Your money stays where it already is.',
  'Every update is one you choose to make.',
]

export function TrustTicker() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <div className="border-t border-gray-100 py-4">
      {reducedMotion ? (
        <p className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 text-center text-sm text-gray-500">
          {MESSAGES.map((message) => (
            <span key={message}>{message}</span>
          ))}
        </p>
      ) : (
        <div className="overflow-hidden" aria-hidden="true">
          <div className="flex w-max animate-marquee items-center whitespace-nowrap">
            {[...MESSAGES, ...MESSAGES].map((message, i) => (
              <span key={i} className="mx-6 text-sm text-gray-500">
                {message}
              </span>
            ))}
          </div>
        </div>
      )}
      {!reducedMotion && <p className="sr-only">{MESSAGES.join('. ')}</p>}
    </div>
  )
}
