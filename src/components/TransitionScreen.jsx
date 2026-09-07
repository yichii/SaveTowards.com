import { PiggyBank } from 'lucide-react'

export function TransitionScreen() {
  return (
    <div className="flex min-h-screen-safe items-center justify-center bg-cream">
      <PiggyBank size={40} className="animate-pulse-soft text-emerald-700" />
    </div>
  )
}
