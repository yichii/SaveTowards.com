import { Hero } from './landing/Hero'
import { TrustTicker } from './landing/TrustTicker'
import { useViewportTier } from '../hooks/useViewportTier'

export function LandingPage({ onStart }) {
  const { ultraCompact } = useViewportTier()

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-stone-50">
      <Hero onStart={onStart} />
      {/* Dropped on very short viewports so the essentials above never need to scroll. */}
      {!ultraCompact && <TrustTicker />}
    </div>
  )
}
