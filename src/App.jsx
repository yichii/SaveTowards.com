import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { GoalForm } from './components/GoalForm'
import { GoalCard } from './components/GoalCard'
import { EmptyState } from './components/EmptyState'

// Older saved goals predate these fields — fill in defaults so they render
// and edit correctly instead of showing "undefined" or crashing.
const GOAL_DEFAULTS = {
  name: '',
  amountSaved: 0,
  category: '',
  payFrequency: 'biweekly',
  visualizationStyle: 'fill',
}

function normalizeGoal(goal) {
  return { ...GOAL_DEFAULTS, ...goal }
}

function App() {
  const [storedGoals, setGoals] = useLocalStorage('savetowards-goals', [])
  const goals = storedGoals.map(normalizeGoal)
  const [editingId, setEditingId] = useState(null)
  const [justCreatedId, setJustCreatedId] = useState(null)

  const editingGoal = editingId && editingId !== 'new' ? goals.find((g) => g.id === editingId) : null
  const isCreating = editingId === 'new'

  function handleSave(goal) {
    const isNewGoal = isCreating
    setGoals((prev) => {
      const exists = prev.some((g) => g.id === goal.id)
      return exists ? prev.map((g) => (g.id === goal.id ? goal : g)) : [...prev, goal]
    })
    setEditingId(null)
    if (isNewGoal) setJustCreatedId(goal.id)
  }

  function handleUpdateSaved(id, amountSaved) {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, amountSaved } : g)))
  }

  function handleChangeVisualization(id, visualizationStyle) {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, visualizationStyle } : g)))
  }

  function handleDelete(id) {
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-10 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">SaveTowards</h1>
          {goals.length > 0 && !isCreating && !editingGoal && (
            <button
              type="button"
              onClick={() => setEditingId('new')}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              <Plus size={16} />
              New Goal
            </button>
          )}
        </div>

        {goals.length === 0 && !isCreating && <EmptyState onCreate={() => setEditingId('new')} />}

        {isCreating && (
          <GoalForm onSave={handleSave} onCancel={() => setEditingId(null)} />
        )}

        {!isCreating && (
          <div className="flex flex-col gap-4">
            {goals.map((goal) =>
              editingGoal?.id === goal.id ? (
                <GoalForm
                  key={goal.id}
                  initialGoal={goal}
                  onSave={handleSave}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onUpdateSaved={handleUpdateSaved}
                  onEdit={setEditingId}
                  onDelete={handleDelete}
                  onChangeVisualization={handleChangeVisualization}
                  justCreated={goal.id === justCreatedId}
                  onIntroComplete={() => setJustCreatedId(null)}
                />
              )
            )}

            {goals.length > 0 && (
              <button
                type="button"
                onClick={() => setEditingId('new')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-emerald-400 hover:text-emerald-700"
              >
                <Plus size={16} />
                Add another goal
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
