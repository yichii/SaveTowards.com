import { Hero } from './landing/Hero'
import { TrustTicker } from './landing/TrustTicker'

export function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero onStart={onStart} />
      <TrustTicker />
    </div>
  )
}
