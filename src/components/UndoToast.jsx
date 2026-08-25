export function UndoToast({ message, onUndo }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4"
    >
      <div className="animate-fade-in-up flex items-center gap-3 rounded-xl bg-stone-900 py-3 pl-4 pr-3 text-sm text-white shadow-lg">
        <span className="font-medium">{message}</span>
        <button
          type="button"
          onClick={onUndo}
          className="rounded-lg px-2.5 py-1 font-semibold text-cyan-300 transition-colors hover:bg-white/10 hover:text-cyan-200"
        >
          Undo
        </button>
      </div>
    </div>
  )
}
