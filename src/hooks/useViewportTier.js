import { useState, useEffect } from 'react'

const COMPACT_QUERY = '(max-height: 700px)'
const ULTRA_COMPACT_QUERY = '(max-height: 520px)'
// Width-only: browser chrome (tabs, bookmarks bar) routinely eats enough
// viewport height to trip COMPACT_QUERY even on a full-size desktop window,
// so a height clause here would make "wide" false for most real desktops.
const WIDE_QUERY = '(min-width: 1024px)'

// Lets landing-page layout shed non-essential content/size at short viewport
// heights (small phones, landscape) so it never needs to scroll, and grow
// icon-driven sizing back up on wide desktop viewports where the height-based
// clamps alone leave the hero looking sparse.
export function useViewportTier() {
  const [compact, setCompact] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(COMPACT_QUERY).matches : false
  )
  const [ultraCompact, setUltraCompact] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(ULTRA_COMPACT_QUERY).matches : false
  )
  const [wide, setWide] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(WIDE_QUERY).matches : false
  )

  useEffect(() => {
    const compactMql = window.matchMedia(COMPACT_QUERY)
    const ultraMql = window.matchMedia(ULTRA_COMPACT_QUERY)
    const wideMql = window.matchMedia(WIDE_QUERY)
    const onCompactChange = (e) => setCompact(e.matches)
    const onUltraChange = (e) => setUltraCompact(e.matches)
    const onWideChange = (e) => setWide(e.matches)
    compactMql.addEventListener('change', onCompactChange)
    ultraMql.addEventListener('change', onUltraChange)
    wideMql.addEventListener('change', onWideChange)
    return () => {
      compactMql.removeEventListener('change', onCompactChange)
      ultraMql.removeEventListener('change', onUltraChange)
      wideMql.removeEventListener('change', onWideChange)
    }
  }, [])

  return { compact, ultraCompact, wide }
}
