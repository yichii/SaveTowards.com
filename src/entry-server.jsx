import { renderToString } from 'react-dom/server'
import { LandingPage } from './components/LandingPage'
import { SeoCalculatorPage } from './pages/seoCalculators/SeoCalculatorPage'
import { findSeoCalculator } from './pages/seoCalculators/registry'

// Server entry used only at build time by scripts/prerender.js. It renders a
// route to static HTML so crawlers and no-JS requests get real copy, not an
// empty <div id="root">. The client bundle boots normally and hydrates this
// markup — see src/main.jsx.
//
// `render(pathname)` returns { html, head }:
//   - html: the markup for #root
//   - head: replacement contents for the <!-- seo:head:start/end --> block in
//     index.html, or null to keep index.html's default (landing) <head>.

const SITE = 'https://savetowards.com'
const noop = () => {}

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderSeoHead(def) {
  const url = `${SITE}/${def.slug}`
  const faqLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: def.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }).replace(/</g, '\\u003c')

  return [
    `<title>${esc(def.title)}</title>`,
    `<meta name="description" content="${esc(def.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="SaveTowards" />`,
    `<meta property="og:title" content="${esc(def.title)}" />`,
    `<meta property="og:description" content="${esc(def.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE}/favicon.svg" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${esc(def.title)}" />`,
    `<meta name="twitter:description" content="${esc(def.description)}" />`,
    `<meta name="twitter:image" content="${SITE}/favicon.svg" />`,
    `<script type="application/ld+json">${faqLd}</script>`,
  ].join('\n    ')
}

export function render(pathname = '/') {
  const def = findSeoCalculator(pathname)
  if (def) {
    return { html: renderToString(<SeoCalculatorPage def={def} />), head: renderSeoHead(def) }
  }
  return {
    html: renderToString(<LandingPage onStart={noop} onRestore={noop} onBack={undefined} />),
    head: null,
  }
}
