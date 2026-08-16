import { SharedGoalCard } from './SharedGoalCard'

// Rendered instead of the dashboard when the URL carries a valid #s= share
// payload. Purely presentational and reads nothing from/writes nothing to
// localStorage — the recipient's own goals, if any, are never touched.
export function SharedGoalView({ payload, onStartOwn }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 py-10">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8 lg:max-w-lg">
        <h1 className="text-center font-heading text-2xl font-bold text-stone-900 lg:text-3xl">SaveTowards</h1>

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
