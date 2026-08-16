import { PiggyBank, Plus } from 'lucide-react'

export function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center lg:py-16">
      <PiggyBank size={32} className="text-cyan-500 lg:size-10" />
      <p className="font-heading text-lg font-semibold text-stone-900 lg:text-xl">No savings goals yet</p>
      <p className="text-sm text-stone-500 lg:text-base">
        Create your first goal to see how much to save each day, week, or month to reach it.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-2 flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-600 lg:px-5 lg:py-2.5 lg:text-base"
      >
        <Plus size={16} />
        Create your first goal
      </button>
    </div>
  )
}
