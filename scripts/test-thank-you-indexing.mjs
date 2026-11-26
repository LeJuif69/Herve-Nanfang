import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const html = await readFile('dist/thank-you/index.html', 'utf8')
const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1]

assert.ok(robots, 'the prerendered thank-you page must have a robots directive')
assert.match(robots, /^noindex\b/, 'the thank-you page must not be indexed')

console.log(`Thank-you route is prerendered with robots="${robots}".`)
