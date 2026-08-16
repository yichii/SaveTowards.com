import { SharedGoalCard } from './SharedGoalCard'

// Rendered instead of the dashboard when the URL carries a valid #s= share
// payload. Purely presentational and reads nothing from/writes nothing to
// localStorage — the recipient's own goals, if any, are never touched.
export function SharedGoalView({ payload, onStartOwn }) {
  return (
    <div className="min-h-screen bg-stone-50 px-4 pt-10 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-md flex-col gap-8">
        <h1 className="text-center font-heading text-2xl font-bold text-stone-900">SaveTowards</h1>

        <SharedGoalCard
          name={payload.name}
          category={payload.category}
          emoji={payload.emoji}
          includeAmounts={payload.includeAmounts}
          targetAmount={payload.targetAmount}
          amountSaved={payload.amountSaved}
          daysToSave={payload.daysToSave}
        />

        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-stone-500">Want to save toward something of your own?</p>
          <button
            type="button"
            onClick={onStartOwn}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
          >
            Start your own goal
          </button>
        </div>
      </div>
    </div>
  )
}
