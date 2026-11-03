import { readdirSync } from 'node:fs'
import { basename } from 'node:path'
import { describe, expect, test } from 'vitest'
import { get } from './http'

function slugsIn(dir: string) {
  return readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => basename(file, '.mdx'))
}

const projectSlugs = slugsIn('app/portfolio/projects')
const postSlugs = slugsIn('app/blog/posts')

describe('pages', () => {
  test('the home page returns 200', async () => {
    let page = await get('/')
    expect(page.status).toBe(200)
    expect(page.html.querySelector('h1')?.text).toBe("Myles Pritchett's Portfolio")
  })

  test('the Projects list returns 200', async () => {
    let page = await get('/portfolio')
    expect(page.status).toBe(200)
    expect(page.html.querySelector('h1')?.text).toBe('My Projects')
  })

  test('the blog list returns 200', async () => {
    let page = await get('/blog')
    expect(page.status).toBe(200)
    expect(page.html.querySelector('h1')?.text).toBe('My Blog')
  })

  test.each(projectSlugs)('the Project page %s returns 200', async (slug) => {
    let page = await get(`/portfolio/${slug}`)
    expect(page.status).toBe(200)
    expect(page.html.querySelector('article.prose')).not.toBeNull()
  })

  test.each(postSlugs)('the Post page %s returns 200', async (slug) => {
    let page = await get(`/blog/${slug}`)
    expect(page.status).toBe(200)
    expect(page.html.querySelector('article.prose')).not.toBeNull()
  })

  test('an unknown URL returns 404', async () => {
    let page = await get('/no-such-page')
    expect(page.status).toBe(404)
  })
})
