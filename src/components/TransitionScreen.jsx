import { PiggyBank } from 'lucide-react'

export function TransitionScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <PiggyBank size={40} className="animate-pulse-soft text-cyan-500" />
    </div>
  )
}
