/**
 * Renders `emoji` twice, stacked: a desaturated/faded base as the "unfilled"
 * state, and a full-color copy clipped to the bottom `percent`% via a
 * height-clipped wrapper — same reveal mechanic as before, just emoji
 * instead of an outline/solid icon pair. Falls back to a target emoji when
 * none is given. Emoji are decorative (aria-hidden); pass `label` to expose
 * the category name to screen readers.
 *
 * Note: emoji glyph shape varies by OS/browser font, unlike the old icon
 * library — expected, not a bug.
 */
export function FillIcon({ emoji, percent, size = 64, celebrating = false, label }) {
  const clamped = Math.min(Math.max(percent, 0), 100)
  const glyph = emoji || '🎯'
  const fontSize = size * 0.78

  return (
    <div
      className={`relative shrink-0 ${celebrating ? 'animate-celebrate motion-reduce:animate-none' : ''}`}
      style={{ width: size, height: size }}
    >
      {label && <span className="sr-only">{label}</span>}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center opacity-45 grayscale"
        style={{ fontSize, lineHeight: 1 }}
      >
        {glyph}
      </span>
      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden transition-all duration-500 ease-out motion-reduce:transition-none"
        style={{ height: `${clamped}%` }}
      >
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 flex items-center justify-center"
          style={{ width: size, height: size, fontSize, lineHeight: 1 }}
        >
          {glyph}
        </span>
      </div>
    </div>
  )
}
