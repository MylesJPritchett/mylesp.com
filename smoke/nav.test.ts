import { describe, expect, test } from 'vitest'
import { get } from './http'

async function navLinks() {
  let page = await get('/')
  return page.html
    .querySelectorAll('nav a')
    .map((a) => ({ href: a.getAttribute('href') ?? '', name: a.text.trim() }))
}

describe('nav', () => {
  test('links to home, Projects and Posts in glossary terms', async () => {
    expect(await navLinks()).toEqual([
      { href: '/', name: 'home' },
      { href: '/projects', name: 'projects' },
      { href: '/blog', name: 'posts' },
    ])
  })

  test('every nav link returns 200', async () => {
    for (let { href } of await navLinks()) {
      let page = await get(href)
      expect(page.status, href).toBe(200)
    }
  })
})
