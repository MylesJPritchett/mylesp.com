// Checks the site's real Projects and Posts, not fixtures: the content Myles
// publishes has to load, and the Featured Projects have to be in the agreed order.
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { getPosts, getProjects as getProjectsIn } from './content'

// Read the real Projects even if PROJECTS_DIR points the content module elsewhere.
const dir = join(__dirname, 'projects', 'projects')
const getProjects = () => getProjectsIn({ dir })

const FEATURED_ORDER = [
  'captivator',
  'flowroll',
  'ingreedients',
  'type-duel',
  'cravory',
  'battlesnake',
  'rpn-calculator',
  'micro-arcade',
  'dynamic-stone-solutions',
]

function isHttpsUrl(value: string) {
  try {
    let url = new URL(value)
    return url.protocol === 'https:' && url.hostname.includes('.')
  } catch {
    return false
  }
}

describe('the real content', () => {
  test('every Project and Post loads without validation errors', () => {
    expect(() => getProjects()).not.toThrow()
    expect(() => getPosts()).not.toThrow()
  })

  test('the Featured Projects are in the agreed order', () => {
    let featured = getProjects().filter((project) => project.order !== undefined)
    expect(featured.map((project) => project.slug)).toEqual(FEATURED_ORDER)
  })

  test('every Project has a Stack', () => {
    let missing = getProjects().filter((project) => !project.stack?.length)
    expect(missing.map((project) => project.slug)).toEqual([])
  })

  test.each(getProjects().flatMap((project) => [
    [project.slug, 'source', project.source],
    ...(project.link ? [[project.slug, 'link', project.link]] : []),
  ]))('%s has a well-formed https %s (%s)', (_slug, _field, url) => {
    expect(isHttpsUrl(url)).toBe(true)
  })

  test('no Project points at the old recipease repo', () => {
    let sources = getProjects().map((project) => project.source.toLowerCase())
    expect(sources.filter((source) => source.includes('recipease'))).toEqual([])
  })
})
