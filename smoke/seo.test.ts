import { describe, expect, test } from 'vitest'
import { get } from './http'
import { postPaths, projectPaths } from './site'

function meta(page: Awaited<ReturnType<typeof get>>, key: string) {
  return page.html
    .querySelector(`meta[name="${key}"], meta[property="${key}"]`)
    ?.getAttribute('content')
}

describe('site metadata', () => {
  test('the home page meta description names Myles Pritchett and the role', async () => {
    let page = await get('/')
    expect(page.html.querySelector('title')?.text).toBe("Myles' Portfolio")
    for (let key of ['description', 'og:description']) {
      expect(meta(page, key)).toContain('Myles Pritchett')
      expect(meta(page, key)).toContain('Fullstack Software Engineer')
    }
  })

  test('a favicon is linked and served', async () => {
    let home = await get('/')
    let href = home.html.querySelector('link[rel="icon"]')?.getAttribute('href')
    expect(href).toBeTruthy()

    let icon = await get(href!)
    expect(icon.status).toBe(200)
    expect(icon.headers.get('content-type')).toMatch(/^image\//)
  })
})

describe('OG image', () => {
  test.each(['/og', '/og?title=Battlesnake%20AI'])('%s returns an image', async (path) => {
    let image = await get(path)
    expect(image.status).toBe(200)
    expect(image.headers.get('content-type')).toMatch(/^image\//)
  })
})

describe('structured data', () => {
  async function structuredData(path: string) {
    let page = await get(path)
    let script = page.html.querySelector('script[type="application/ld+json"]')
    expect(script, path).not.toBeNull()
    return { page, data: JSON.parse(script!.text) }
  }

  async function expectValid(path: string, type: string) {
    let { page, data } = await structuredData(path)
    expect(data['@context'], path).toBe('https://schema.org')
    expect(data['@type'], path).toBe(type)
    expect(data.author, path).toMatchObject({ '@type': 'Person', name: 'Myles Pritchett' })
    expect(new URL(data.image).protocol, path).toBe('https:')
    expect(data.image, path).toBe(meta(page, 'og:image'))
  }

  test('every Project page is SoftwareSourceCode by Myles Pritchett with an absolute image', async () => {
    let paths = await projectPaths()
    expect(paths.length).toBeGreaterThan(0)
    for (let path of paths) await expectValid(path, 'SoftwareSourceCode')
  })

  test('every Post page is a BlogPosting by Myles Pritchett with an absolute image', async () => {
    let paths = await postPaths()
    expect(paths.length).toBeGreaterThan(0)
    for (let path of paths) await expectValid(path, 'BlogPosting')
  })
})

describe('Projects list', () => {
  function accessibleName(link: ReturnType<Awaited<ReturnType<typeof get>>['html']['querySelector']>) {
    return (link?.getAttribute('aria-label') ?? link?.text ?? '').trim()
  }

  test('every link has accessible text', async () => {
    let page = await get('/projects')
    let links = page.html.querySelectorAll('main > section a')
    expect(links.length).toBeGreaterThan(0)
    for (let link of links) {
      expect(accessibleName(link), link.toString()).toMatch(/\w/)
    }
  })

  test('icon-only links say what they open and for which Project', async () => {
    let page = await get('/projects')
    let names = page.html
      .querySelectorAll('main > section a[target="_blank"]')
      .map(accessibleName)
    expect(names.length).toBeGreaterThan(0)
    for (let name of names) {
      expect(name).toMatch(/^(Live site|Source code) for \w/)
    }
  })
})
