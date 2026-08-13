import { useLocalStorage } from './hooks/useLocalStorage'
import { GoalForm } from './components/GoalForm'
import { GoalCard } from './components/GoalCard'

function App() {
  const [goals, setGoals] = useLocalStorage('savetowards-goals', [])
  const goal = goals[0]

  function handleCreate(newGoal) {
    setGoals([newGoal])
  }

  function handleUpdateSaved(id, amountSaved) {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, amountSaved } : g)))
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">SaveTowards</h1>
        {goal ? (
          <GoalCard goal={goal} onUpdateSaved={handleUpdateSaved} />
        ) : (
          <GoalForm onCreate={handleCreate} />
        )}
      </div>
    </div>
  )
}

export default App
