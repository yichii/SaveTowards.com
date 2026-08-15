export function EmojiPicker({ options, value, onChange }) {
  if (!options?.length) return null

  return (
    <div className="flex gap-2">
      {options.map((emoji) => {
        const selected = value === emoji
        return (
          <button
            key={emoji}
            type="button"
            onClick={() => onChange(emoji)}
            aria-pressed={selected}
            aria-label={`Use ${emoji} icon`}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border text-lg transition-colors ${
              selected
                ? 'border-cyan-500 bg-cyan-50'
                : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <span aria-hidden="true">{emoji}</span>
          </button>
        )
      })}
    </div>
  )
}
