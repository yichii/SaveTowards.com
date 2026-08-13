import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { GoalForm } from './components/GoalForm'
import { GoalCard } from './components/GoalCard'

function App() {
  const [goals, setGoals] = useLocalStorage('savetowards-goals', [])
  const [editingId, setEditingId] = useState(null)

  const editingGoal = editingId && editingId !== 'new' ? goals.find((g) => g.id === editingId) : null
  const isCreating = editingId === 'new'

  function handleSave(goal) {
    setGoals((prev) => {
      const exists = prev.some((g) => g.id === goal.id)
      return exists ? prev.map((g) => (g.id === goal.id ? goal : g)) : [...prev, goal]
    })
    setEditingId(null)
  }

  function handleUpdateSaved(id, amountSaved) {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, amountSaved } : g)))
  }

  function handleDelete(id) {
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">SaveTowards</h1>

        {goals.length === 0 && !isCreating && <GoalForm onSave={handleSave} />}

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
