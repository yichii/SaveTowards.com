import { Hero } from './landing/Hero'

export function LandingPage({ onStart }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-stone-50">
      <Hero onStart={onStart} />
    </div>
  )
}
