import { Hero } from './landing/Hero'

export function LandingPage({ onStart, onRestore, onBack }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-stone-50">
      <Hero onStart={onStart} onRestore={onRestore} onBack={onBack} />
    </div>
  )
}
