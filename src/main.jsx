import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'
import { decodeSharePayload } from './utils/shareLink'
import { findSeoCalculator } from './pages/seoCalculators/registry'
import { SeoCalculatorPage } from './pages/seoCalculators/SeoCalculatorPage'

const rootEl = document.getElementById('root')

// Standalone calculator pages (/vacation-savings-calculator, etc.) live at
// their own URLs and are prerendered by scripts/prerender.js. When the path
// is one of them, that page owns the whole document — hydrate the prerendered
// markup (or client-render it in dev, where there's no prerender).
const seoDef = findSeoCalculator(window.location.pathname)

if (seoDef) {
  const seoTree = (
    <StrictMode>
      <SeoCalculatorPage def={seoDef} />
      <Analytics />
    </StrictMode>
  )
  if (rootEl.hasChildNodes()) {
    hydrateRoot(rootEl, seoTree)
  } else {
    rootEl.innerHTML = ''
    createRoot(rootEl).render(seoTree)
  }
} else {
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
}
