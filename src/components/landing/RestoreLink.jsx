import { useRef, useState } from 'react'
import { parseImportPayload } from '../../utils/goalIO'

// Lets a returning visitor whose localStorage is empty (new browser, cleared
// data) get straight back to their goals instead of restarting from scratch.
export function RestoreLink({ onRestore }) {
  const fileInputRef = useRef(null)
  const [error, setError] = useState('')

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const importedGoals = parseImportPayload(String(reader.result))
        setError('')
        onRestore(importedGoals)
      } catch (err) {
        setError(err.message)
      }
    }
    reader.onerror = () => setError('Couldn’t read that file — please try again.')
    reader.readAsText(file)
  }

  return (
    <div className="mt-2 text-xs text-stone-400 lg:text-sm">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="underline decoration-dotted underline-offset-2 hover:text-stone-600"
      >
        Already have goals saved? Restore from a file.
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleFileChange}
        className="hidden"
      />
      {error && <p className="mt-1 text-rose-500">{error}</p>}
    </div>
  )
}
