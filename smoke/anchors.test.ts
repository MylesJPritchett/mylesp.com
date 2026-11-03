import { describe, expect, test } from 'vitest'
import { get } from './http'
import { postPaths, projectPaths } from './site'

describe('heading anchors', () => {
  test('on every Project and Post page, each anchor points at an existing id', async () => {
    let paths = [...(await projectPaths()), ...(await postPaths())]
    expect(paths.length).toBeGreaterThan(0)
    let checked = 0

    for (let path of paths) {
      let page = await get(path)
      let ids = new Set(page.html.querySelectorAll('[id]').map((el) => el.id))
      for (let anchor of page.html.querySelectorAll('article a.anchor')) {
        let href = anchor.getAttribute('href') ?? ''
        expect(href, `${path}: ${href}`).toMatch(/^#.+/)
        expect(ids.has(decodeURIComponent(href.slice(1))), `${path}: ${href}`).toBe(true)
        checked++
      }
    }
    expect(checked).toBeGreaterThan(0)
  })
})
