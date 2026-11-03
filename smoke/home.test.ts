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
})
