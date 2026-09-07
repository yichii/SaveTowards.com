import { forwardRef, useState } from 'react'
import {
  Target,
  Palmtree,
  Gem,
  Baby,
  GraduationCap,
  Umbrella,
  Gift,
  Home,
  Car,
  Armchair,
  ArrowRight,
} from 'lucide-react'
import { Modal } from '../Modal'
import { SectionHeading } from './SectionHeading'

// Everyday goals all run through today's general plan flow, so their tiles
// route straight into it (`live: true`). Home / Car / Retirement are getting
// dedicated plans with advanced fields later — their tiles are preview-only:
// a "Coming soon" pill and a short description of what's coming. "Other" is
// the live catch-all and stays last in the grid.
const TILES = [
  {
    key: 'vacation',
    label: 'Vacation',
    icon: Palmtree,
    live: true,
  },
  {
    key: 'wedding',
    label: 'Wedding',
    icon: Gem,
    live: true,
  },
  {
    key: 'baby',
    label: 'Baby',
    icon: Baby,
    live: true,
  },
  {
    key: 'college',
    label: 'College',
    icon: GraduationCap,
    live: true,
  },
  {
    key: 'emergency',
    label: 'Emergency savings',
    icon: Umbrella,
    live: true,
  },
  {
    key: 'gift',
    label: 'Gift',
    icon: Gift,
    live: true,
  },
  {
    key: 'home',
    label: 'Home',
    icon: Home,
    live: false,
    blurb:
      'Plan your down payment and see what home price fits your budget, including mortgage rate, PMI, and closing costs.',
  },
  {
    key: 'car',
    label: 'Car',
    icon: Car,
    live: false,
    blurb:
      'Figure out your target down payment and monthly savings for your next car, factoring in loan terms.',
  },
  {
    key: 'retirement',
    label: 'Retirement',
    icon: Armchair,
    live: false,
    blurb:
      'See how your monthly contributions grow over time toward your retirement goal.',
  },
  {
    key: 'other',
    label: 'Other',
    icon: Target,
    live: true,
  },
]

export const CategoryHub = forwardRef(function CategoryHub({ onStartGeneral }, ref) {
  const [previewKey, setPreviewKey] = useState(null)
  const preview = TILES.find((t) => t.key === previewKey) ?? null

  return (
    <section
      ref={ref}
      id="start"
      className="scroll-mt-20 bg-cream px-4 py-14 lg:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          title="Saving for something starts with a plan"
          subtitle="Pick what you're saving for to begin."
        />

        <div className="rounded-2xl shadow-sm">
          <div className="relative rounded-t-2xl bg-emerald-900 px-4 py-3.5 text-center sm:px-6 sm:py-4">
            <h3 className="font-heading text-[15px] font-bold text-white sm:text-base lg:text-lg">
              Tell us about your savings goal
            </h3>
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-full z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-emerald-900"
            />
          </div>

          <div className="rounded-b-2xl border border-t-0 border-emerald-900/10 bg-white px-3 pt-8 pb-5 sm:px-4 lg:px-8 lg:pt-10">
            <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
              {TILES.map((tile) => (
                <li key={tile.key}>
                  <CategoryTile
                    tile={tile}
                    onClick={() => (tile.live ? onStartGeneral() : setPreviewKey(tile.key))}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {preview && (
        <Modal onClose={() => setPreviewKey(null)}>
          <div className="rounded-2xl bg-white p-6 shadow-xl lg:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                <preview.icon size={22} strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="font-heading text-lg font-bold text-emerald-950">
                  {preview.label} plan
                </h3>
                <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700/70">
                  Coming soon
                </span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-emerald-900/70 lg:text-base">{preview.blurb}</p>
            <p className="mt-3 text-sm text-emerald-900/55">
              It isn&apos;t live yet — you can plan this as a general goal in the meantime.
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setPreviewKey(null)
                  onStartGeneral()
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                Start a general goal
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => setPreviewKey(null)}
                className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-emerald-900/55 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
              >
                Back to categories
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
})

function CategoryTile({ tile, onClick }) {
  const { label, icon: Icon, live } = tile

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={live ? label : `${label} — coming soon, preview`}
      className="group flex h-full w-full flex-col items-center gap-2 rounded-xl border border-emerald-900/10 bg-white px-2 py-4 text-center shadow-[0_1px_3px_rgba(6,78,59,0.06)] transition-all hover:-translate-y-0.5 hover:border-emerald-700 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:gap-2.5 sm:py-5"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 transition-colors group-hover:bg-emerald-200 sm:h-14 sm:w-14">
        <Icon size={24} strokeWidth={1.75} />
      </span>
      <span className="flex min-h-[2.4em] items-start justify-center text-[13px] font-semibold leading-tight text-emerald-950 sm:text-sm">
        {label}
      </span>
      {live ? (
        <span aria-hidden="true" className="h-[18px]" />
      ) : (
        <span className="rounded-full bg-emerald-900/[0.06] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-800/70">
          Coming soon
        </span>
      )}
    </button>
  )
}
