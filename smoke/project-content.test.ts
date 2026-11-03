import { describe, expect, test } from 'vitest'
import { get } from './http'

describe('Project content', () => {
  test.each(['captivator', 'flowroll', 'type-duel'])(
    'the new Project page %s returns 200',
    async (slug) => {
      let page = await get(`/projects/${slug}`)
      expect(page.status).toBe(200)
    }
  )

  test.each([
    ['/projects/recipease', '/projects/cravory'],
    ['/portfolio/recipease', '/projects/cravory'],
    ['/projects/mylesp-personal-site', '/projects'],
    ['/portfolio/mylesp-personal-site', '/projects'],
  ])('the removed or renamed %s permanently redirects to %s', async (from, to) => {
    let page = await get(from)
    expect(page.status).toBe(308)
    expect(new URL(page.headers.get('location') ?? '', 'http://x').pathname).toBe(to)
  })

  test('the Cravory page links to the cravory repo', async () => {
    let page = await get('/projects/cravory')
    let hrefs = page.html.querySelectorAll('a').map((a) => a.getAttribute('href'))
    expect(hrefs).toContain('https://github.com/MylesJPritchett/cravory')
    expect(hrefs.filter((href) => href?.includes('recipease'))).toEqual([])
  })

  test('Type Duel shows the In Progress marker by its title', async () => {
    let page = await get('/projects/type-duel')
    let markers = page.html
      .querySelector('h1')
      ?.querySelectorAll('span')
      .filter((span) => span.text.trim() === 'In Progress')
    expect(markers).toHaveLength(1)
  })
})
