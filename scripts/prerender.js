// Post-build step. Runs after `vite build` (client) and `vite build --ssr`
// (server bundle in dist-ssr/). It:
//   1. injects the statically rendered landing page into dist/index.html
//   2. writes one dist/<slug>/index.html per standalone calculator page, each
//      with its own <head> (title/meta/canonical/OG + FAQ JSON-LD)
//   3. regenerates dist/sitemap.xml from the same page list
// The client bundle still boots and hydrates all of this — see src/main.jsx.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { SEO_CALCULATORS } from '../src/pages/seoCalculators/registry.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const templatePath = resolve(root, 'dist/index.html')
const serverEntryPath = resolve(root, 'dist-ssr/entry-server.js')
const SITE = 'https://savetowards.com'

const ROOT_DIV = '<div id="root"></div>'
const HEAD_START = '<!-- seo:head:start -->'
const HEAD_END = '<!-- seo:head:end -->'

const { render } = await import(pathToFileURL(serverEntryPath).href)
const template = readFileSync(templatePath, 'utf-8')

if (!template.includes(ROOT_DIV)) {
  throw new Error(`prerender: expected ${ROOT_DIV} in dist/index.html — build output changed?`)
}
if (!template.includes(HEAD_START) || !template.includes(HEAD_END)) {
  throw new Error('prerender: seo:head markers missing from index.html')
}

function withRoot(tpl, html) {
  return tpl.replace(ROOT_DIV, `<div id="root">${html}</div>`)
}

function withHead(tpl, headHtml) {
  const from = tpl.indexOf(HEAD_START) + HEAD_START.length
  const to = tpl.indexOf(HEAD_END)
  return `${tpl.slice(0, from)}\n    ${headHtml}\n    ${tpl.slice(to)}`
}

// 1. Landing page — keep index.html's existing <head>, just fill in #root.
const landing = render('/')
writeFileSync(templatePath, withRoot(template, landing.html))
console.log('prerender: injected landing page into dist/index.html')

// 2. One static page per calculator, each at its own URL with its own <head>.
for (const def of SEO_CALCULATORS) {
  const { html, head } = render(`/${def.slug}`)
  const page = withHead(withRoot(template, html), head)
  const dir = resolve(root, 'dist', def.slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, 'index.html'), page)
  console.log(`prerender: wrote dist/${def.slug}/index.html`)
}

// 3. Sitemap — home plus every calculator page.
const today = new Date().toISOString().slice(0, 10)
const paths = ['', ...SEO_CALCULATORS.map((c) => c.slug)]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map((p) => `  <url>\n    <loc>${SITE}/${p}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
  .join('\n')}
</urlset>
`
writeFileSync(resolve(root, 'dist/sitemap.xml'), sitemap)
console.log(`prerender: wrote dist/sitemap.xml (${paths.length} urls)`)
