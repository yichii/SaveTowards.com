import { ChevronDown } from 'lucide-react'
import { Logo } from '../Logo'

// Landing-only top bar. Mirrors the dark-green panel header on `CategoryHub`
// and the Fidelity "Goal Booster" reference. Links are limited to actions
// that actually exist: scroll to the goal hub, and (for a returning
// visitor) go back to their dashboard. No fake "How it works" / "Log in".
export function Header({ onScrollToHub, onBack }) {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-950/30 bg-emerald-900 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3 lg:px-8">
        <span className="flex items-center gap-2 font-heading text-[15px] font-bold sm:text-base">
          <Logo size={20} className="shrink-0 text-white" />
          SaveTowards
        </span>

        <nav className="flex items-center gap-1 sm:gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-md px-2.5 py-1.5 text-[13px] font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 sm:px-3 sm:text-sm"
            >
              My goals
            </button>
          )}
          <button
            type="button"
            onClick={onScrollToHub}
            className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 sm:px-3 sm:text-sm"
          >
            <span className="sm:hidden">Start</span>
            <span className="hidden sm:inline">Start your plan</span>
            <ChevronDown size={15} className="shrink-0" />
          </button>
        </nav>
      </div>
    </header>
  )
}
