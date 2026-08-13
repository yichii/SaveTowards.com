import { PiggyBank, Plus } from 'lucide-react'

export function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
      <PiggyBank size={32} className="text-emerald-500" />
      <p className="text-lg font-semibold text-gray-900">No savings goals yet</p>
      <p className="text-sm text-gray-500">
        Create your first goal to see how much to save each day, week, or month to reach it.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        <Plus size={16} />
        Create your first goal
      </button>
    </div>
  )
}
