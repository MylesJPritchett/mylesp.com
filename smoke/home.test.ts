import { describe, expect, test } from 'vitest'
import { get } from './http'

const headline =
  'Fullstack Software Engineer in Sydney. TypeScript, Next.js, Rust. Open to new roles, available now.'

describe('home page', () => {
  test('shows the headline', async () => {
    let page = await get('/')
    expect(page.html.text).toContain(headline)
  })

  test.each([
    'mailto:mylesjpritchett@gmail.com',
    'https://www.linkedin.com/in/myles-pritchett/',
    'https://github.com/MylesJPritchett/',
    '/Myles-Pritchett-Resume.pdf',
  ])('links to %s', async (href) => {
    let page = await get('/')
    let main = page.html.querySelector('main section')
    let links = main?.querySelectorAll('a').map((a) => a.getAttribute('href'))
    expect(links).toContain(href)
  })

  test.each([
    ['Fullstack Software Engineer', 'Zion Metrics', 'Jan 2026 – Nov 2026'],
    ['Software Developer', 'Unicard Systems', 'Apr 2023 – Jan 2026'],
    [
      'Software Support and Deployment',
      'Unicard Systems',
      'Apr 2022 – Apr 2023',
    ],
    ['Software Developer and Support', 'Lymlive Media', 'Oct 2021 – Feb 2022'],
  ])('lists the Experience %s at %s, %s', async (title, employer, dates) => {
    let page = await get('/')
    let roles = page.html
      .querySelectorAll('#experience li')
      .map((role) => role.text.replace(/\s+/g, ' '))
    expect(
      roles.some(
        (role) =>
          role.includes(title) && role.includes(employer) && role.includes(dates)
      )
    ).toBe(true)
  })

  test('ends Experience with a full resume download', async () => {
    let page = await get('/')
    let link = page.html
      .querySelectorAll('#experience a')
      .find((a) => a.text.trim() === 'Full resume')
    expect(link?.getAttribute('href')).toBe('/Myles-Pritchett-Resume.pdf')
  })

  test('does not mention the $50M figure', async () => {
    let page = await get('/')
    expect(page.body).not.toContain('$50')
  })

  test('orders sections Experience, Projects, Posts', async () => {
    let page = await get('/')
    let headings = page.html.querySelectorAll('h2').map((h2) => h2.text)
    expect(headings).toEqual(['Experience', 'Projects', 'Posts'])
  })
})

describe('footer', () => {
  test('leads with LinkedIn and email, keeping RSS and view source', async () => {
    let page = await get('/')
    let links = page.html
      .querySelectorAll('footer a')
      .map((a) => a.getAttribute('href'))
    expect(links.slice(0, 2)).toEqual([
      'https://www.linkedin.com/in/myles-pritchett/',
      'mailto:mylesjpritchett@gmail.com',
    ])
    expect(links).toContain('/rss')
    expect(links).toContain('https://github.com/MylesJPritchett/mylesp.com')
  })
})
