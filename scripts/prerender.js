// Post-build step: inject the statically rendered landing page into
// dist/index.html so the first byte served already contains the real copy and
// the FAQ JSON-LD. Runs after `vite build` (client) and `vite build --ssr`
// (server bundle in dist-ssr/). The client bundle still boots normally and
// hydrates this markup — see src/main.jsx.
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const templatePath = resolve(root, 'dist/index.html')
const serverEntryPath = resolve(root, 'dist-ssr/entry-server.js')
const ROOT_DIV = '<div id="root"></div>'

const { render } = await import(pathToFileURL(serverEntryPath).href)
const appHtml = render()

const template = readFileSync(templatePath, 'utf-8')
if (!template.includes(ROOT_DIV)) {
  throw new Error(`prerender: expected ${ROOT_DIV} in dist/index.html — build output changed?`)
}

const html = template.replace(ROOT_DIV, `<div id="root">${appHtml}</div>`)
writeFileSync(templatePath, html)

console.log('prerender: injected landing page into dist/index.html')
