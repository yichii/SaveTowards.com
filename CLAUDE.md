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
  "emoji": "string (single emoji, optional — user-picked from the category's curated set, used by the Fill visualization; falls back to the category's default emoji when absent)",
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
- The dashboard's goal cards support four visualization styles, user-selectable per goal via `VisualizationPicker`: Bar (MVP default), Ring, **Fill** (the goal's emoji is desaturated/faded as a base layer, with a full-color copy clipped from the bottom up in the same proportion as the saved percentage), and **Journey** (a marker moves along a path toward the goal's lucide category icon). All four are live — don't treat Fill/Journey as future-phase or landing-page-only anymore. Fill's emoji is user-picked in `GoalForm` via `EmojiPicker`, from a small curated set per category defined in `CategoryPicker.jsx` (`emojiOptions`); it's stored per-goal (`emoji` field) and falls back to the category's default (first option) when unset. Journey still uses the lucide icon set, untouched by this — the two visualizations intentionally use different icon sources.
- Headline stat (one clear number, e.g. "$47/week") is always the most prominent element on a goal card. Full breakdown (day/week/month/paycheck) is hidden behind a "Show More" toggle — don't show all four by default.
- No user accounts, no login, no cloud database. This is intentional, not a placeholder to fill in without being asked.
- Category selection is from a small preset icon set — never build a custom photo upload feature unless explicitly requested.

## Landing Page
A landing page exists at `src/components/LandingPage.jsx`, shown before the dashboard to first-time visitors (no goals yet in `localStorage`). Returning users with saved goals skip it entirely — this routing decision is made once at mount in `App.jsx`, not re-evaluated if goals are later deleted mid-session.
- The page scrolls: a sticky `Header` (`src/components/landing/Header.jsx` — dark-green bar, white `SaveTowards` wordmark, a "See the calculators" button that scrolls to the hub, and a "My goals" button shown only when `onBack` is set) sits above a Hero (`src/components/landing/Hero.jsx`, `HeroDemo.jsx`, `useHeroDemo.js`), then a `CategoryHub` (`src/components/landing/CategoryHub.jsx`) and a `Footer` (`src/components/landing/Footer.jsx`), composed by `LandingPage.jsx` which owns the smooth-scroll ref between hero and hub. The wordmark/back affordance lives in the `Header` now, not the Hero; the Hero's section height is `calc(100dvh - 3.25rem)` to leave room for the sticky bar. The footer is SEO-oriented: a keyword-rich brand blurb, a `Savings calculators` nav of search-phrased anchor links (all `href="#calculators"` — the hub `<section id="calculators">` — that also call `onExplore` to smooth-scroll), a feature list, a not-financial-advice disclaimer, copyright, and "Back to top". No FAQ block — it was tried and removed. The Hero has a two-line typewriter headline ("How do I start saving for" + an animated goal phrase, underlined, with a blinking cursor), a subhead about the value prop, a "See the calculators" button that scrolls down to the hub (it does NOT route into a calculator — that's the hub's job), a Fill-style demo card built on the real `FillIcon`/`calculateSavingsPlan` code, and a bouncing chevron scroll cue (hidden on short viewports).
- `CategoryHub` is the primary interaction, styled after Fidelity's "Goal Booster" panel: a dark-green header bar ("Tell us about your savings goal") with a rotated-square notch, over a white card holding an icon+label tile grid (lucide-react, `strokeWidth 1.75`, pale-green `bg-emerald-100` circular badge). Tiles come from the `TILES` array — order matters. The everyday ones (**Vacation, Wedding, Baby, College, Emergency savings, Gift**, plus **Other** which stays last) are `live: true` and all call `onStartGeneral` (wired to `App.jsx`'s `onStart`, the exact old "Start a goal" flow → `TransitionScreen` → `GoalForm`) — no per-category prefill, they're all the same general flow, the label is just an on-ramp. **Home / Car / Retirement** are `live: false`: a "Coming soon" pill and a `Modal` preview with 2-3 sentences (the `blurb` field) of what that dedicated calculator will do, plus a "Start a general goal" fallback and a "Back to categories" close (on top of the Modal's own X / Escape / backdrop close). No Home/Car/Retirement calculator logic exists yet — the previews are copy-only placeholders for future prompts.
- One palette across the whole app (landing page, goal-creation flow, and dashboard): dark green (`emerald-700`/`800`/`950`) as the brand/anchor color, `emerald-700` primary actions (hover `emerald-800`), emerald-tinted neutrals (`text-emerald-900/70`, `border-emerald-900/10`, pale `bg-emerald-50`/`emerald-100`), all on a warm cream background (`--color-cream` / `bg-cream`, defined in `index.css`). The old dashboard cyan/stone scheme was migrated to this — don't reintroduce cyan or stone. Destructive/warning colors (`rose`/`red`, `amber`) are unchanged.
- A single shared example-goal array (Toyota Camry / Moonlit Wedding / Trip to Vegas, in `useHeroDemo.js`) drives the headline phrase, headline icon, and demo card together on one cycle: backspace the phrase, swap the icon, then type the new phrase while the card's fill/percent/slider animate from 0 to that goal's target. While the user is interacting with the slider, autoplay (typing, icon swap, and fill animation) pauses; it resumes automatically, restarting the cycle from the first goal, after `RESUME_AFTER_MS` (4s) of slider inactivity — resets on every interaction, not just the first touch. `HeroDemo.jsx` is purely presentational, driven by props from the `useHeroDemo` hook. The headline's animated phrase is `aria-hidden`, with a static `sr-only` `<h1>` for assistive tech. `usePrefersReducedMotion` (`src/hooks/usePrefersReducedMotion.js`) disables all autoplay animation and the ticker's scroll for users who request it.
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
