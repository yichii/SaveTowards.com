import { Hero } from './landing/Hero'

export function LandingPage({ onStart, onRestore }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-stone-50">
      <Hero onStart={onStart} onRestore={onRestore} />
    </div>
  )
}
