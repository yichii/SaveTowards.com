import { Circle, MapPin } from 'lucide-react'

const WIDTH = 200
const HEIGHT = 64
const PATH_Y = HEIGHT / 2
const START_X = 16
const END_X = WIDTH - 16

/**
 * A straight path from start to the goal icon, with a marker sliding along
 * it based on amountSaved / targetAmount. Falls back to a plain circle when
 * no category icon is given.
 */
export function JourneyProgress({ icon, percent, size = 64, celebrating = false }) {
  const clamped = Math.min(Math.max(percent, 0), 100)
  const Icon = icon || Circle
  const markerX = START_X + ((END_X - START_X) * clamped) / 100

  return (
    <div className="w-full" style={{ maxWidth: WIDTH * (size / HEIGHT) }}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={`w-full ${celebrating ? 'animate-celebrate' : ''}`}
        style={{ height: size }}
      >
        <line x1={START_X} y1={PATH_Y} x2={END_X} y2={PATH_Y} strokeWidth={2} className="stroke-gray-200" />
        <circle cx={START_X} cy={PATH_Y} r={4} className="fill-gray-300" />

        <g transform={`translate(${END_X - 12}, ${PATH_Y - 12})`} className="text-gray-300">
          <Icon size={24} strokeWidth={1.5} />
        </g>

        <g transform={`translate(${markerX}, ${PATH_Y})`} className="transition-transform duration-500 ease-out">
          <MapPin
            size={20}
            strokeWidth={2}
            fill="currentColor"
            x={-10}
            y={-20}
            className="text-emerald-500"
          />
        </g>
      </svg>
    </div>
  )
}
