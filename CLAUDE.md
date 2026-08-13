# SaveTowards

Web app that helps people figure out how much to save (daily/weekly/monthly/per paycheck) to hit any savings goal by a target date, with a simple visual progress tracker. Broad audience — must feel approachable, not like a bank/finance tool.

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
- Single-page app, no routing library needed unless a second distinct view is explicitly requested
- `src/components/` — UI components (GoalForm, GoalCard, GoalDashboard, ProgressBar, etc.)
- `src/hooks/useLocalStorage.js` — persistence layer; all goal data reads/writes go through this, not raw `localStorage` calls scattered in components
- `src/utils/calculations.js` — all savings-math logic lives here, isolated from UI components, so it can be tested independently

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
- MVP visualization is a **progress bar only**. Do not build image-reveal, puzzle-piece, or journey-map visualizations unless explicitly asked — they are planned for a later phase.
- Headline stat (one clear number, e.g. "$47/week") is always the most prominent element on a goal card. Full breakdown (day/week/month/paycheck) is hidden behind a "Show More" toggle — don't show all four by default.
- No user accounts, no login, no cloud database. This is intentional, not a placeholder to fill in without being asked.
- Category selection is from a small preset icon set — never build a custom photo upload feature unless explicitly requested.

## Code Style
- Destructure props/imports where reasonable
- Keep components small and single-purpose; if a component exceeds ~150 lines, flag it and suggest splitting
- No inline styles — Tailwind utility classes only

## Hard Rules
- Never add a backend, database, or auth flow without explicit instruction — this app is local-storage-only until told otherwise
- Never introduce a new npm package without stating what it's for and asking first if it's a major dependency (state management libraries, routing, backend SDKs, etc.)
- If a request is ambiguous, prefer the simpler MVP-consistent interpretation over a more "complete" feature-rich one
