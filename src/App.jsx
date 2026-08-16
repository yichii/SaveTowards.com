import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { GoalForm } from './components/GoalForm'
import { GoalCard } from './components/GoalCard'
import { EmptyState } from './components/EmptyState'
import { LandingPage } from './components/LandingPage'
import { TransitionScreen } from './components/TransitionScreen'
import { DataPortability } from './components/DataPortability'
import { mergeGoals } from './utils/goalIO'

const LANDING_TRANSITION_MS = 500

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
  // Returning users with goals already saved skip straight to the dashboard —
  // only first-time visitors (nothing in localStorage yet) see the landing
  // page. Decided once at mount so deleting all goals mid-session doesn't
  // bounce someone back to it.
  const [showLanding, setShowLanding] = useState(() => storedGoals.length === 0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  // Goals saved before createdAt/lastUpdatedAt existed are missing them —
  // backfill both with today's date once, and persist the migration so it
  // only needs to run once per goal.
  useEffect(() => {
    setGoals((prev) => {
      const now = new Date().toISOString()
      let changed = false
      const migrated = prev.map((g) => {
        if (g.createdAt && g.lastUpdatedAt) return g
        changed = true
        return { ...g, createdAt: g.createdAt ?? now, lastUpdatedAt: g.lastUpdatedAt ?? now }
      })
      return changed ? migrated : prev
    })
  }, [])

  useEffect(() => {
    if (!isTransitioning) return
    const delay = prefersReducedMotion ? 0 : LANDING_TRANSITION_MS
    const timer = setTimeout(() => {
      setShowLanding(false)
      setEditingId('new')
      setIsTransitioning(false)
    }, delay)
    return () => clearTimeout(timer)
  }, [isTransitioning, prefersReducedMotion])

  if (isTransitioning) {
    return <TransitionScreen />
  }

  if (showLanding) {
    return <LandingPage onStart={() => setIsTransitioning(true)} onRestore={handleRestoreFromLanding} />
  }

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
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, amountSaved, lastUpdatedAt: new Date().toISOString() } : g))
    )
  }

  function handleChangeVisualization(id, visualizationStyle) {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, visualizationStyle } : g)))
  }

  function handleDelete(id) {
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  function handleImportGoals(importedGoals) {
    const { merged, added, alreadyPresent } = mergeGoals(storedGoals, importedGoals)
    setGoals(merged)
    return { added, alreadyPresent }
  }

  function handleRestoreFromLanding(importedGoals) {
    handleImportGoals(importedGoals)
    setShowLanding(false)
  }

  return (
    <div className="min-h-screen bg-stone-50 px-4 pt-10 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="font-heading text-2xl font-bold text-stone-900">SaveTowards</h1>
          {goals.length > 0 && !isCreating && !editingGoal && (
            <button
              type="button"
              onClick={() => setEditingId('new')}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
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
                className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-stone-300 py-3 text-sm font-medium text-stone-500 transition-colors hover:border-cyan-400 hover:text-cyan-700"
              >
                <Plus size={16} />
                Add another goal
              </button>
            )}
          </div>
        )}

        {!isCreating && !editingGoal && (
          <DataPortability goals={goals} onImport={handleImportGoals} />
        )}
      </div>
    </div>
  )
}

export default App
