import { useState, useEffect } from 'react'
import { Plus, Layers } from 'lucide-react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { GoalForm } from './components/GoalForm'
import { GoalCard } from './components/GoalCard'
import { EmptyState } from './components/EmptyState'
import { LandingPage } from './components/LandingPage'
import { TransitionScreen } from './components/TransitionScreen'
import { DataPortability } from './components/DataPortability'
import { TotalsSummary } from './components/TotalsSummary'
import { GoalOrchestration } from './components/GoalOrchestration'
import { Modal } from './components/Modal'
import { SharedGoalView } from './components/SharedGoalView'
import { Logo } from './components/Logo'
import { SortMenu } from './components/SortMenu'
import { mergeGoals } from './utils/goalIO'
import { decodeSharePayload } from './utils/shareLink'
import { calculateSavingsPlan } from './utils/calculations'
import { defaultDirectionFor, sortGoals } from './utils/sortGoals'

const LANDING_TRANSITION_MS = 500

// Older saved goals predate these fields — fill in defaults so they render
// and edit correctly instead of showing "undefined" or crashing.
const GOAL_DEFAULTS = {
  name: '',
  amountSaved: 0,
  category: '',
  payFrequency: 'biweekly',
  visualizationStyle: 'fill',
  celebrationShown: false,
}

function normalizeGoal(goal) {
  return { ...GOAL_DEFAULTS, ...goal }
}

function App() {
  const [storedGoals, setGoals] = useLocalStorage('savetowards-goals', [])
  const [takeHomePay, setTakeHomePay] = useLocalStorage('savetowards-take-home-pay', '')
  const [sortType, setSortType] = useLocalStorage('savetowards-sort-type', 'recent')
  const [sortDirection, setSortDirection] = useLocalStorage('savetowards-sort-direction', 'desc')
  const goals = storedGoals.map(normalizeGoal)
  // Feeds income-share math on the cards/orchestration view without
  // polluting the stored/exported goal objects — take-home pay lives once,
  // globally, not per goal.
  const goalsWithIncome = goals.map((g) => ({ ...g, takeHomePay: Number(takeHomePay) || 0 }))
  const [editingId, setEditingId] = useState(null)
  const [justCreatedId, setJustCreatedId] = useState(null)
  const [showOrchestration, setShowOrchestration] = useState(false)
  // Returning users with goals already saved skip straight to the dashboard —
  // only first-time visitors (nothing in localStorage yet) see the landing
  // page. Decided once at mount so deleting all goals mid-session doesn't
  // bounce someone back to it.
  const [showLanding, setShowLanding] = useState(() => storedGoals.length === 0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  // A shared-goal link overrides everything else on load, even for a
  // returning user with their own goals — it's read once at mount and never
  // touches localStorage, so the recipient's own data stays untouched.
  const [sharedPayload, setSharedPayload] = useState(() => decodeSharePayload(window.location.hash))

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

  // Take-home pay used to live per-goal — adopt the first value found as the
  // new global setting, then strip the now-unused field from every goal.
  useEffect(() => {
    const legacyValue = storedGoals.find((g) => g.takeHomePay)?.takeHomePay
    if (legacyValue && takeHomePay === '') {
      setTakeHomePay(String(legacyValue))
    }
    if (storedGoals.some((g) => 'takeHomePay' in g)) {
      setGoals((prev) => prev.map(({ takeHomePay, ...rest }) => rest))
    }
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

  if (sharedPayload) {
    return (
      <SharedGoalView
        payload={sharedPayload}
        onStartOwn={() => {
          window.history.replaceState(null, '', window.location.pathname + window.location.search)
          setSharedPayload(null)
          if (storedGoals.length === 0) {
            setIsTransitioning(true)
          } else {
            setShowLanding(false)
            setEditingId('new')
          }
        }}
      />
    )
  }

  if (isTransitioning) {
    return <TransitionScreen />
  }

  if (showLanding) {
    return (
      <LandingPage
        onStart={() => setIsTransitioning(true)}
        onRestore={handleRestoreFromLanding}
        onBack={storedGoals.length > 0 ? () => setShowLanding(false) : undefined}
      />
    )
  }

  const editingGoal = editingId && editingId !== 'new' ? goals.find((g) => g.id === editingId) : null
  const isCreating = editingId === 'new'
  // Past-due goals still count as "active" for this purpose — only goals
  // that have hit their target (status 'met') are excluded, since there's
  // nothing left to allocate toward them.
  const activeGoalsCount = goals.filter((g) => calculateSavingsPlan(g).status !== 'met').length
  const canPlanAcrossGoals = activeGoalsCount >= 2

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

  function handleUpdateGoal(id, updates) {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates, lastUpdatedAt: new Date().toISOString() } : g))
    )
  }

  function handleDelete(id) {
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  function handleCelebrationShown(id) {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, celebrationShown: true } : g)))
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

  function handleSortChange(nextType) {
    if (nextType === sortType) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortType(nextType)
      setSortDirection(defaultDirectionFor(nextType))
    }
  }

  function handleApplyOrchestration(updates) {
    const now = new Date().toISOString()
    setGoals((prev) =>
      prev.map((g) => {
        const update = updates.find((u) => u.id === g.id)
        return update ? { ...g, targetDate: update.targetDate, lastUpdatedAt: now } : g
      })
    )
    setShowOrchestration(false)
  }

  return (
    <div className="min-h-screen-safe bg-stone-50 px-4 pt-[calc(2.5rem+env(safe-area-inset-top))] pb-[calc(2.5rem+env(safe-area-inset-bottom))] lg:px-8 lg:pt-[calc(3.5rem+env(safe-area-inset-top))]">
      <div className="mx-auto max-w-md lg:max-w-5xl xl:max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-2 lg:mb-10 lg:gap-3">
          <h1 className="font-heading text-2xl font-bold text-stone-900 lg:text-3xl">
            <button
              type="button"
              onClick={() => setShowLanding(true)}
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <Logo size={22} className="text-cyan-600 lg:h-7 lg:w-7" />
              SaveTowards
            </button>
          </h1>
          {goals.length > 0 && !isCreating && !editingGoal && (
            <div className="flex items-center gap-1.5 lg:gap-2">
              {goals.length > 1 && (
                <SortMenu sortType={sortType} direction={sortDirection} onChange={handleSortChange} />
              )}
              {goals.length > 1 && (
                <button
                  type="button"
                  onClick={() => canPlanAcrossGoals && setShowOrchestration(true)}
                  title={canPlanAcrossGoals ? undefined : 'Add another goal to plan an allocation across them'}
                  aria-label="Plan goals"
                  className={`flex items-center justify-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 p-2 text-sm font-semibold text-cyan-700 lg:px-4 lg:py-2 ${
                    canPlanAcrossGoals
                      ? 'transition-colors hover:bg-cyan-100'
                      : 'cursor-not-allowed opacity-40'
                  }`}
                >
                  <Layers size={16} className="shrink-0" />
                  <span className="hidden lg:inline">Plan goals</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setEditingId('new')}
                aria-label="New Goal"
                className="flex items-center justify-center gap-1.5 rounded-lg bg-cyan-500 p-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-600 lg:px-4 lg:py-2"
              >
                <Plus size={16} className="shrink-0" />
                <span className="hidden lg:inline">New Goal</span>
              </button>
            </div>
          )}
        </div>

        {goals.length === 0 && !isCreating && (
          <div className="lg:mx-auto lg:max-w-xl">
            <EmptyState onCreate={() => setEditingId('new')} />
          </div>
        )}

        {isCreating && (
          <div className="lg:mx-auto lg:max-w-2xl">
            <GoalForm
              onSave={handleSave}
              onCancel={() => setEditingId(null)}
              takeHomePay={takeHomePay}
              onTakeHomePayChange={setTakeHomePay}
            />
          </div>
        )}

        {!isCreating && <TotalsSummary goals={goals} onCelebrationShown={handleCelebrationShown} />}

        {!isCreating && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 xl:grid-cols-3">
            {sortGoals(goalsWithIncome, sortType, sortDirection).map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdateSaved={handleUpdateSaved}
                onUpdateGoal={handleUpdateGoal}
                onEdit={setEditingId}
                onDelete={handleDelete}
                onChangeVisualization={handleChangeVisualization}
                justCreated={goal.id === justCreatedId}
                onIntroComplete={() => setJustCreatedId(null)}
              />
            ))}

            {goals.length > 0 && (
              <button
                type="button"
                onClick={() => setEditingId('new')}
                className="col-span-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-stone-300 py-3 text-sm font-medium text-stone-500 transition-colors hover:border-cyan-400 hover:text-cyan-700"
              >
                <Plus size={16} />
                Add another goal
              </button>
            )}
          </div>
        )}

        {!isCreating && <DataPortability goals={goals} onImport={handleImportGoals} />}
      </div>

      {editingGoal && (
        <Modal onClose={() => setEditingId(null)}>
          <GoalForm
            initialGoal={editingGoal}
            onSave={handleSave}
            onCancel={() => setEditingId(null)}
            takeHomePay={takeHomePay}
            onTakeHomePayChange={setTakeHomePay}
          />
        </Modal>
      )}

      {showOrchestration && (
        <Modal onClose={() => setShowOrchestration(false)}>
          <GoalOrchestration goals={goalsWithIncome} onApply={handleApplyOrchestration} />
        </Modal>
      )}
    </div>
  )
}

export default App
