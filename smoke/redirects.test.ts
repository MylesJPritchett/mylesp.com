import { readdirSync } from 'node:fs'
import { basename } from 'node:path'
import { describe, expect, test } from 'vitest'
import { get } from './http'

const projectSlugs = readdirSync('app/projects/projects')
  .filter((file) => file.endsWith('.mdx'))
  .map((file) => basename(file, '.mdx'))

const oldUrls = [
  ['/portfolio', '/projects'],
  ...projectSlugs.map((slug) => [`/portfolio/${slug}`, `/projects/${slug}`]),
]

describe('redirects', () => {
  test.each(oldUrls)('%s permanently redirects to %s', async (from, to) => {
    let page = await get(from)
    expect(page.status).toBe(308)
    expect(new URL(page.headers.get('location') ?? '', 'http://x').pathname).toBe(to)
  })
})
