import { describe, expect, test } from 'vitest'
import { getProjects } from '../app/content'
import { get, type Page } from './http'

function diagramRows(page: Page) {
  let diagram = page.html.querySelector('dl[aria-label="Stack"]')
  return diagram?.querySelectorAll('dt').map((dt) => ({
    layer: dt.text.trim(),
    technologies: dt.nextElementSibling!.querySelectorAll('li').map((li) => li.text.trim()),
  }))
}

const projects = getProjects()

describe('Stack', () => {
  test('a Project page shows one diagram row per Layer used, in Layer order', async () => {
    let page = await get('/projects/battlesnake')

    expect(diagramRows(page)).toEqual([
      { layer: 'Backend', technologies: ['Rust', 'Rocket'] },
      { layer: 'Infra', technologies: ['Docker', 'GitHub Actions', 'DigitalOcean'] },
    ])
  })

  test('the Projects list shows a Project\'s technologies as tags, in Layer order', async () => {
    let page = await get('/projects')
    let tags = page.html.querySelector('ul[aria-label="Battlesnake AI Stack"]')

    expect(tags?.querySelectorAll('li').map((li) => li.text.trim())).toEqual([
      'Rust',
      'Rocket',
      'Docker',
      'GitHub Actions',
      'DigitalOcean',
    ])
  })

  test.each(projects.map((project) => [project.slug, project] as const))(
    'the Project page %s shows a diagram only if the Project has a Stack',
    async (slug, project) => {
      let page = await get(`/projects/${slug}`)

      expect(diagramRows(page)).toEqual(project.stack)
    }
  )
})
