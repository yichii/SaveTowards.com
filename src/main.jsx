import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'
import { decodeSharePayload } from './utils/shareLink'

const rootEl = document.getElementById('root')

const tree = (
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>
)

// The build prerenders the landing page into #root (see scripts/prerender.js).
// That markup is only correct for a first-time visitor: no goals saved yet and
// no shared-goal link in the URL — exactly the cases where App mounts straight
// into <LandingPage>. Hydrate it then; otherwise the first render is the
// dashboard or a shared-goal view, so clear the stale markup and mount fresh.
function hasStoredGoals() {
  try {
    const raw = window.localStorage.getItem('savetowards-goals')
    return raw !== null && Array.isArray(JSON.parse(raw)) && JSON.parse(raw).length > 0
  } catch {
    return false
  }
}

const prerenderMatches =
  rootEl.hasChildNodes() && !hasStoredGoals() && !decodeSharePayload(window.location.hash)

if (prerenderMatches) {
  hydrateRoot(rootEl, tree)
} else {
  rootEl.innerHTML = ''
  createRoot(rootEl).render(tree)
}
