import { Hero } from './landing/Hero'
import { TrustTicker } from './landing/TrustTicker'

export function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="px-4 pt-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-lg font-bold text-gray-900">SaveTowards</p>
        </div>
      </header>
      <Hero onStart={onStart} />
      <TrustTicker />
    </div>
  )
}
