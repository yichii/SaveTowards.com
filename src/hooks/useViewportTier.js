import { useState, useEffect } from 'react'

const COMPACT_QUERY = '(max-height: 700px)'
const ULTRA_COMPACT_QUERY = '(max-height: 520px)'

// Lets landing-page layout shed non-essential content/size at short viewport
// heights (small phones, landscape) so it never needs to scroll.
export function useViewportTier() {
  const [compact, setCompact] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(COMPACT_QUERY).matches : false
  )
  const [ultraCompact, setUltraCompact] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(ULTRA_COMPACT_QUERY).matches : false
  )

  useEffect(() => {
    const compactMql = window.matchMedia(COMPACT_QUERY)
    const ultraMql = window.matchMedia(ULTRA_COMPACT_QUERY)
    const onCompactChange = (e) => setCompact(e.matches)
    const onUltraChange = (e) => setUltraCompact(e.matches)
    compactMql.addEventListener('change', onCompactChange)
    ultraMql.addEventListener('change', onUltraChange)
    return () => {
      compactMql.removeEventListener('change', onCompactChange)
      ultraMql.removeEventListener('change', onUltraChange)
    }
  }, [])

  return { compact, ultraCompact }
}
