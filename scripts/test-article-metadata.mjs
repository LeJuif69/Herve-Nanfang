import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { ARTICLES } from '../src/data/articles.ts'
import { ARTICLE_SUMMARIES } from '../src/data/article-summaries.ts'

const publishedArticles = ARTICLES.filter((article) => article.status === 'Publié')
const summaryBySlug = new Map(ARTICLE_SUMMARIES.map((article) => [article.slug, article]))

assert.equal(summaryBySlug.size, ARTICLE_SUMMARIES.length, 'article summary slugs must be unique')

for (const article of publishedArticles) {
  const summary = summaryBySlug.get(article.slug)
  assert.ok(summary, `published article ${article.slug} must have a lightweight summary`)
  assert.ok(summary.relatedSlugs?.length, `${article.slug} must link to related Journal articles`)
  assert.ok(
    summary.relatedSlugs.every((slug) => slug !== article.slug && summaryBySlug.has(slug)),
    `${article.slug} relatedSlugs must refer to existing, different articles`,
  )
  if (article.publishedAt) {
    assert.match(article.publishedAt, /^\d{4}-\d{2}-\d{2}$/, `${article.slug} date must be ISO YYYY-MM-DD`)
    assert.equal(summary.publishedAt, article.publishedAt, `${article.slug} summary date must match its source`)
  }
}

for (const summary of ARTICLE_SUMMARIES) {
  const article = ARTICLES.find((candidate) => candidate.slug === summary.slug)
  assert.ok(article, `summary ${summary.slug} must resolve to a full article`)
  assert.deepEqual(summary.relatedSlugs, article.relatedSlugs, `${summary.slug} relation metadata must match`)
}

const rss = await readFile('public/journal/rss.xml', 'utf8')
const rssItems = [...rss.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => match[1])
assert.equal(rssItems.length, publishedArticles.length, 'RSS must include every published article exactly once')

const datedPublishedArticles = publishedArticles.filter((article) => article.publishedAt)
const rssDatedItems = rssItems.filter((item) => item.includes('<pubDate>'))
assert.equal(
  rssDatedItems.length,
  datedPublishedArticles.length,
  'RSS must omit publication dates that are not verified instead of inventing a build date',
)

for (const article of datedPublishedArticles) {
  const item = rssItems.find((candidate) => candidate.includes(`/journal/${article.slug}`))
  assert.ok(item, `RSS must contain ${article.slug}`)
  assert.ok(item.includes(new Date(article.publishedAt).toUTCString()), `${article.slug} RSS date must match source`)
}

console.log(
  `Article metadata valid: ${publishedArticles.length} published articles, ${datedPublishedArticles.length} verified dates.`,
)
