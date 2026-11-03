import { readdirSync } from 'node:fs'
import { basename } from 'node:path'
import { describe, expect, test } from 'vitest'
import { get } from './http'

function slugsIn(dir: string) {
  return readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => basename(file, '.mdx'))
}

const site = 'https://mylesp.com'

async function sitemapUrls() {
  let page = await get('/sitemap.xml')
  expect(page.status).toBe(200)
  return page.html.querySelectorAll('loc').map((loc) => loc.text.trim())
}

describe('sitemap', () => {
  test('lists every URL exactly once', async () => {
    let urls = await sitemapUrls()
    expect(urls.length).toBeGreaterThan(0)
    expect(new Set(urls).size).toBe(urls.length)
  })

  test('lists home, the Projects list and the blog', async () => {
    let urls = await sitemapUrls()
    expect(urls).toEqual(
      expect.arrayContaining([site, `${site}/projects`, `${site}/blog`])
    )
  })

  test('lists every Project', async () => {
    let urls = await sitemapUrls()
    for (let slug of slugsIn('app/projects/projects')) {
      expect(urls).toContain(`${site}/projects/${slug}`)
    }
  })

  test('lists every Post', async () => {
    let urls = await sitemapUrls()
    for (let slug of slugsIn('app/blog/posts')) {
      expect(urls).toContain(`${site}/blog/${slug}`)
    }
  })

  test('has no /portfolio URLs', async () => {
    let urls = await sitemapUrls()
    expect(urls.filter((url) => url.includes('/portfolio'))).toEqual([])
  })
})
