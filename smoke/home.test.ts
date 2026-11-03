import { describe, expect, test } from 'vitest'
import { get } from './http'

const headline =
  'Fullstack Software Engineer in Sydney. TypeScript, Next.js, Rust. Open to new roles, available now.'

describe('home page', () => {
  test('shows the headline', async () => {
    let page = await get('/')
    expect(page.html.text).toContain(headline)
  })
})
