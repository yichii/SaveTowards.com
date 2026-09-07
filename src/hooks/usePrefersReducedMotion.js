import { useState, useEffect } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

// Starts from the no-preference default and syncs in an effect (rather than
// reading matchMedia in the lazy initializer) so the first client render
// matches the prerendered HTML — the browser-only value lands right after
// hydration instead of diverging during it.
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    setReduced(mql.matches)
    const onChange = (e) => setReduced(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return reduced
}
