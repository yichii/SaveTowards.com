# SaveTowards

Web app that helps people figure out how much to save (daily/weekly/monthly/per paycheck) to hit any savings goal by a target date, with a simple visual progress tracker. Broad audience — must feel approachable, not like a bank/finance tool.

Product in one sentence: SaveTowards tells you exactly how much to save per day/week/month/paycheck to hit a goal by a date, and shows visual progress toward it. Audience is broad and general — a teenager saving for a car, a couple saving for a honeymoon — tone should feel approachable and encouraging, not corporate/banking.

## Tech Stack
- React (functional components + hooks only, no class components)
- Tailwind CSS for all styling
- localStorage for persistence — **no backend, no database, no auth in this phase**
- Plain JS/JSX (not TypeScript) unless told otherwise
- Icons: lucide-react

## Commands
- `npm run dev` — start local dev server
- `npm run build` — production build
- (Add lint/test commands here once configured — none exist yet)

## Architecture
- Single-page app, no routing library. Top-level view (landing vs. dashboard) is plain React state in `App.jsx`, decided once at mount from whether `localStorage` already has goals — no URL-based routing, so there's nothing to configure on the host for deep links
- `src/components/` — dashboard UI components (GoalForm, GoalCard, ProgressBar, FillIcon, JourneyProgress, RingProgress, VisualizationPicker, CategoryPicker, EmptyState, etc.)
- `src/components/landing/` — landing page sections (Hero, HeroDemo, HowItWorks, TrustSection, SocialProof, FinalCTA), composed by `src/components/LandingPage.jsx`
- `src/hooks/useLocalStorage.js` — persistence layer; all goal data reads/writes go through this, not raw `localStorage` calls scattered in components
- `src/utils/calculations.js` — all savings-math logic lives here, isolated from UI components, so it can be tested independently (also reused by the landing page's hero demo, for correctness)

## Data Model
Each goal is stored as:
```json
{
  "id": "uuid",
  "name": "string (optional)",
  "targetAmount": "number",
  "amountSaved": "number, default 0",
  "targetDate": "ISO date string",
  "category": "string (icon key, optional)",
  "payFrequency": "weekly | biweekly | monthly, default biweekly",
  "createdAt": "ISO date string"
}
```

## Core Math Rules (do not add complexity beyond this without being asked)
- No interest, no inflation adjustment — simple division only
- `required_per_day = (targetAmount - amountSaved) / days_remaining`
- Derive week/month/paycheck rates from `required_per_day`
- Always handle: target date in the past, goal already met, target date is today — these need graceful states, not errors

## Product Rules — Read Before Building Any Feature
- The dashboard's goal cards support four visualization styles, user-selectable per goal via `VisualizationPicker`: Bar (MVP default), Ring, **Fill** (a category icon fills up like a container), and **Journey** (a marker moves along a path toward the goal icon). All four are live — don't treat Fill/Journey as future-phase or landing-page-only anymore.
- Headline stat (one clear number, e.g. "$47/week") is always the most prominent element on a goal card. Full breakdown (day/week/month/paycheck) is hidden behind a "Show More" toggle — don't show all four by default.
- No user accounts, no login, no cloud database. This is intentional, not a placeholder to fill in without being asked.
- Category selection is from a small preset icon set — never build a custom photo upload feature unless explicitly requested.

## Landing Page
A landing page exists at `src/components/LandingPage.jsx`, shown before the dashboard to first-time visitors (no goals yet in `localStorage`). Returning users with saved goals skip it entirely — this routing decision is made once at mount in `App.jsx`, not re-evaluated if goals are later deleted mid-session.
- Currently a header + Hero + a thin trust-message ticker (`src/components/landing/Hero.jsx`, `HeroDemo.jsx`, `useHeroDemo.js`, `TrustTicker.jsx`): a two-line headline (small icon + "SaveTowards", then a typewriter-animated goal phrase, underlined, with a blinking cursor), subhead, "Start a goal" CTA, and a Fill-style demo card built on the real `FillIcon`/`calculateSavingsPlan` code.
- A single shared example-goal array (Toyota Camry / Moonlit Wedding / Trip to Vegas, in `useHeroDemo.js`) drives the headline phrase, headline icon, and demo card together on one cycle: backspace the phrase, swap the icon, then type the new phrase while the card's fill/percent/slider animate from 0 to that goal's target — until the user first touches the slider, at which point autoplay (typing, icon swap, and fill animation) stops permanently, no snap-back. `HeroDemo.jsx` is purely presentational, driven by props from the `useHeroDemo` hook. The headline's animated phrase is `aria-hidden`, with a static `sr-only` `<h1>` for assistive tech. `usePrefersReducedMotion` (`src/hooks/usePrefersReducedMotion.js`) disables all autoplay animation and the ticker's scroll for users who request it.
- An earlier pass added How It Works / Trust / Social Proof / Final CTA sections below the hero — these were explicitly removed for not being up to standard and deleted from the codebase (not just unmounted). Don't re-add that content from memory; if these sections come back, they need to be redesigned, not restored as they were.
- Copy tone: positive framing, no deficit framing, no generic fintech filler ("empower," "seamless," overusing "journey" as marketing language). Plain and specific over corporate.
- No routing library — landing vs. dashboard is a single boolean view switch in `App.jsx`, not URL-based, so there's no server rewrite/host config needed.

## Code Style
- Destructure props/imports where reasonable
- Keep components small and single-purpose; if a component exceeds ~150 lines, flag it and suggest splitting
- No inline styles — Tailwind utility classes only

## Hard Rules
- Never add a backend, database, or auth flow without explicit instruction — this app is local-storage-only until told otherwise
- Never introduce a new npm package without stating what it's for and asking first if it's a major dependency (state management libraries, routing, backend SDKs, etc.)
- If a request is ambiguous, prefer the simpler MVP-consistent interpretation over a more "complete" feature-rich one
