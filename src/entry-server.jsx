import { renderToString } from 'react-dom/server'
import { LandingPage } from './components/LandingPage'

// Server entry used only at build time by scripts/prerender.js. It renders
// the landing page — the one view a first-time visitor (no goals in
// localStorage) sees — to static HTML so crawlers and no-JS requests get the
// real copy and the FAQ JSON-LD, not an empty <div id="root">.
//
// Props mirror what App.jsx passes for a first-time visitor: onBack is
// undefined (no dashboard to go back to yet), and the callbacks are inert
// here since they only matter once React has hydrated on the client.
const noop = () => {}

export function render() {
  return renderToString(<LandingPage onStart={noop} onRestore={noop} onBack={undefined} />)
}
