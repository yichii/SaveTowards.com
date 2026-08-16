import { useRef, useState } from 'react'
import { Download, Upload, X } from 'lucide-react'
import { exportGoals, parseImportPayload } from '../utils/goalIO'

// A footer card for the utility export/import actions — visible enough to
// notice without competing with the goal cards for attention.
export function DataPortability({ goals, onImport }) {
  const fileInputRef = useRef(null)
  const [message, setMessage] = useState(null) // { type: 'success' | 'error', text: string }

  function handleExport() {
    exportGoals(goals)
  }

  function handlePickFile() {
    fileInputRef.current?.click()
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = '' // allow re-selecting the same file later
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const importedGoals = parseImportPayload(String(reader.result))
        const { added, alreadyPresent } = onImport(importedGoals)
        const parts = []
        if (added > 0) parts.push(`${added} goal${added === 1 ? '' : 's'} added`)
        if (alreadyPresent > 0) parts.push(`${alreadyPresent} already had this device up to date`)
        setMessage({
          type: 'success',
          text: parts.length > 0 ? parts.join(', ') + '.' : 'No changes — everything already matched.',
        })
      } catch (err) {
        setMessage({ type: 'error', text: err.message })
      }
    }
    reader.onerror = () => setMessage({ type: 'error', text: 'Couldn’t read that file — please try again.' })
    reader.readAsText(file)
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-4 text-center lg:flex-row lg:flex-wrap lg:justify-between lg:gap-4 lg:px-6 lg:text-left">
      <div>
        <p className="text-sm font-medium text-stone-700">Your goals, yours to keep</p>
        <p className="mt-0.5 text-xs text-stone-500">
          Everything lives on this device only — export a copy or import one to move it.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={handleExport}
          disabled={goals.length === 0}
          className="flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-sm font-medium text-cyan-700 transition-colors hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-cyan-50"
        >
          <Download size={15} />
          Export
        </button>
        <button
          type="button"
          onClick={handlePickFile}
          className="flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-sm font-medium text-cyan-700 transition-colors hover:bg-cyan-100"
        >
          <Upload size={15} />
          Import
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleFileChange}
        className="hidden"
      />

      {message && (
        <div
          role="status"
          className={`flex w-full items-start justify-between gap-2 rounded-lg px-3 py-2 text-xs ${
            message.type === 'success'
              ? 'bg-cyan-50 text-cyan-800'
              : 'bg-rose-50 text-rose-700'
          }`}
        >
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="shrink-0 text-current opacity-60 hover:opacity-100"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
