import type { HTMLElement } from 'node-html-parser'
import { describe, expect, inject, test } from 'vitest'
import { getProjects } from '../app/content'
import { get } from './http'

// The smoke build reads Projects from a directory holding the real Projects
// plus the fixtures in smoke/fixtures/projects, so an In Progress Featured
// Project always exists here, whatever the real Projects say.
const projects = getProjects({ dir: inject('projectsDir') })

function projectLinks(root: HTMLElement) {
  return root
    .querySelectorAll('a')
    .filter((a) => a.getAttribute('href')?.startsWith('/projects/'))
}

function inProgressMarkers(root: HTMLElement) {
  return root
    .querySelectorAll('span')
    .filter((span) => span.text.trim() === 'In Progress')
}

describe('Projects list', () => {
  test('the smoke build has an In Progress and a not In Progress Featured Project', () => {
    expect(projects.some((p) => p.order !== undefined && p.inProgress)).toBe(true)
    expect(projects.some((p) => p.order !== undefined && !p.inProgress)).toBe(true)
  })

  test.each(['/', '/projects'])('%s lists Projects in content module order', async (path) => {
    let page = await get(path)
    let slugs = projectLinks(page.html).map((a) =>
      a.getAttribute('href')?.replace('/projects/', '')
    )
    expect(slugs).toEqual(projects.map((p) => p.slug))
  })

  test.each(['/', '/projects'])('%s marks In Progress Projects and nothing else', async (path) => {
    let page = await get(path)
    let marked = projectLinks(page.html).map((a) => inProgressMarkers(a).length)
    expect(marked).toEqual(projects.map((p) => (p.inProgress ? 1 : 0)))
    expect(inProgressMarkers(page.html)).toHaveLength(
      projects.filter((p) => p.inProgress).length
    )
  })
})

describe('Project page', () => {
  test.each(projects.map((p) => [p.slug, p.inProgress] as const))(
    '%s shows the In Progress marker by its title only when In Progress (%s)',
    async (slug, inProgress) => {
      let page = await get(`/projects/${slug}`)
      let heading = page.html.querySelector('h1')
      expect(heading).not.toBeNull()
      expect(inProgressMarkers(heading!)).toHaveLength(inProgress ? 1 : 0)
      expect(inProgressMarkers(page.html)).toHaveLength(inProgress ? 1 : 0)
    }
  )
})
