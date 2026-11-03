import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, test } from 'vitest'
import { formatDate, getPost, getPosts, getProject, getProjects } from './content'

let dirs: string[] = []

function contentDir(files: Record<string, string>) {
  let dir = mkdtempSync(join(tmpdir(), 'content-'))
  dirs.push(dir)
  for (let [name, text] of Object.entries(files)) {
    writeFileSync(join(dir, name), text)
  }
  return dir
}

afterEach(() => {
  for (let dir of dirs) rmSync(dir, { recursive: true, force: true })
  dirs = []
})

describe('Projects', () => {
  test('a valid Project parses to its frontmatter and content', () => {
    let dir = contentDir({
      'battlesnake.mdx': `---
title: "Battlesnake AI"
publishedAt: "2024-04-06"
summary: "An AI for Battlesnake: written in Rust"
source: "https://github.com/MylesJPritchett/ferisss"
link: "https://play.battlesnake.com"
image: "/battlesnake/board.png"
---

This is an AI for Battlesnake.
`,
    })

    expect(getProjects({ dir })).toEqual([
      {
        slug: 'battlesnake',
        title: 'Battlesnake AI',
        publishedAt: '2024-04-06',
        summary: 'An AI for Battlesnake: written in Rust',
        source: 'https://github.com/MylesJPritchett/ferisss',
        link: 'https://play.battlesnake.com',
        image: '/battlesnake/board.png',
        inProgress: false,
        content: 'This is an AI for Battlesnake.',
      },
    ])
  })

  test('a Project without a link or image has neither field, not empty strings', () => {
    let dir = contentDir({
      'rpn-calculator.mdx': `---
title: "RPN Calculator"
publishedAt: "2024-11-12"
summary: "A TUI calculator"
source: "https://github.com/MylesJPritchett/rpn-calc"
link: ""
---
`,
    })

    let [project] = getProjects({ dir })
    expect(project).not.toHaveProperty('link')
    expect(project).not.toHaveProperty('image')
  })

  test.each(['title', 'publishedAt', 'summary', 'source'])(
    'a Project missing %s fails, naming the file',
    (field) => {
      let fields: Record<string, string> = {
        title: 'Cravory',
        publishedAt: '2024-07-15',
        summary: 'Recipes from what you have',
        source: 'https://github.com/MylesJPritchett/cravory',
      }
      delete fields[field]
      let frontmatter = Object.entries(fields)
        .map(([key, value]) => `${key}: "${value}"`)
        .join('\n')
      let dir = contentDir({ 'cravory.mdx': `---\n${frontmatter}\n---\n` })

      expect(() => getProjects({ dir })).toThrow(/cravory\.mdx/)
      expect(() => getProjects({ dir })).toThrow(new RegExp(field))
    }
  )

  test.each(['last spring', '2024-13-01', '2024-02-30'])(
    'a Project with the date "%s" fails, naming the file',
    (date) => {
      let dir = contentDir({
        'type-duel.mdx': `---
title: "Type Duel"
publishedAt: "${date}"
summary: "A typing duel"
source: "https://github.com/MylesJPritchett/type-duel"
---
`,
      })

      expect(() => getProjects({ dir })).toThrow(/type-duel\.mdx.*publishedAt/)
    }
  )

  test('a Project whose frontmatter is not valid YAML fails, naming the file', () => {
    let dir = contentDir({
      'flowroll.mdx': `---
title: "Flowroll
publishedAt: [2026-01-01
---
`,
    })

    expect(() => getProjects({ dir })).toThrow(/flowroll\.mdx/)
  })

  test('a Project with no frontmatter block fails, naming the file', () => {
    let dir = contentDir({ 'captivator.mdx': 'Just a write-up, no frontmatter.\n' })

    expect(() => getProjects({ dir })).toThrow(/captivator\.mdx/)
  })

  test('a Project whose frontmatter is a list rather than fields fails, naming the file', () => {
    let dir = contentDir({ 'captivator.mdx': '---\n- title\n- summary\n---\n' })

    expect(() => getProjects({ dir })).toThrow(/captivator\.mdx/)
  })

  test('Projects come back newest first, with same-day Projects in slug order', () => {
    let project = (title: string, publishedAt: string) => `---
title: "${title}"
publishedAt: "${publishedAt}"
summary: "About ${title}"
source: "https://github.com/MylesJPritchett/example"
---
`
    let dir = contentDir({
      'battlesnake.mdx': project('Battlesnake', '2024-04-06'),
      'micro-arcade.mdx': project('Micro Arcade', '2025-12-01'),
      'ingreedients.mdx': project('Ingreedients', '2024-09-28'),
      'dynamic-stone-solutions.mdx': project('Dynamic Stone Solutions', '2024-09-28'),
    })

    expect(getProjects({ dir }).map((p) => p.slug)).toEqual([
      'micro-arcade',
      'dynamic-stone-solutions',
      'ingreedients',
      'battlesnake',
    ])
  })

  describe('Featured Project order', () => {
    let project = (title: string, publishedAt: string, extra = '') => `---
title: "${title}"
publishedAt: "${publishedAt}"
summary: "About ${title}"
source: "https://github.com/MylesJPritchett/example"
${extra}---
`

    test('Projects with an order come first, in ascending order', () => {
      let dir = contentDir({
        'battlesnake.mdx': project('Battlesnake', '2024-04-06', 'order: 2\n'),
        'micro-arcade.mdx': project('Micro Arcade', '2025-12-01'),
        'recipease.mdx': project('Recipease', '2023-03-01', 'order: 1\n'),
        'rpn-calculator.mdx': project('RPN Calculator', '2024-11-12', 'order: 10\n'),
      })

      expect(getProjects({ dir }).map((p) => p.slug)).toEqual([
        'recipease',
        'battlesnake',
        'rpn-calculator',
        'micro-arcade',
      ])
    })

    test('Projects without an order follow, newest first', () => {
      let dir = contentDir({
        'battlesnake.mdx': project('Battlesnake', '2024-04-06'),
        'micro-arcade.mdx': project('Micro Arcade', '2025-12-01'),
        'recipease.mdx': project('Recipease', '2023-03-01', 'order: 1\n'),
        'ingreedients.mdx': project('Ingreedients', '2024-09-28'),
      })

      expect(getProjects({ dir }).map((p) => p.slug)).toEqual([
        'recipease',
        'micro-arcade',
        'ingreedients',
        'battlesnake',
      ])
    })

    test('Projects with the same order, or unordered on the same day, break ties by slug', () => {
      let dir = contentDir({
        'recipease.mdx': project('Recipease', '2023-03-01', 'order: 1\n'),
        'battlesnake.mdx': project('Battlesnake', '2025-04-06', 'order: 1\n'),
        'ingreedients.mdx': project('Ingreedients', '2024-09-28'),
        'dynamic-stone-solutions.mdx': project('Dynamic Stone Solutions', '2024-09-28'),
      })

      expect(getProjects({ dir }).map((p) => p.slug)).toEqual([
        'battlesnake',
        'recipease',
        'dynamic-stone-solutions',
        'ingreedients',
      ])
    })

    test('adding an unordered Project does not change the order of Featured Projects', () => {
      let featured = {
        'battlesnake.mdx': project('Battlesnake', '2024-04-06', 'order: 2\n'),
        'recipease.mdx': project('Recipease', '2023-03-01', 'order: 1\n'),
      }
      let before = getProjects({ dir: contentDir(featured) }).map((p) => p.slug)
      let after = getProjects({
        dir: contentDir({ ...featured, 'micro-arcade.mdx': project('Micro Arcade', '2026-10-01') }),
      }).map((p) => p.slug)

      expect(before).toEqual(['recipease', 'battlesnake'])
      expect(after).toEqual(['recipease', 'battlesnake', 'micro-arcade'])
    })

    test.each(['1.5', '"1"', 'first', '[1]'])(
      'a Project with the order %s fails, naming the file',
      (order) => {
        let dir = contentDir({
          'battlesnake.mdx': project('Battlesnake', '2024-04-06', `order: ${order}\n`),
        })

        expect(() => getProjects({ dir })).toThrow(/battlesnake\.mdx.*order/)
      }
    )
  })

  describe('In Progress', () => {
    let project = (status?: string) => `---
title: "Flowroll"
publishedAt: "2026-01-01"
summary: "A jiu jitsu flow tracker"
source: "https://github.com/MylesJPritchett/flowroll"
${status === undefined ? '' : `status: ${status}\n`}---
`

    test('a Project with status in-progress is In Progress', () => {
      let dir = contentDir({ 'flowroll.mdx': project('in-progress') })

      expect(getProjects({ dir })[0].inProgress).toBe(true)
    })

    test('a Project without a status is not In Progress', () => {
      let dir = contentDir({ 'flowroll.mdx': project() })

      expect(getProjects({ dir })[0].inProgress).toBe(false)
    })

    test.each(['done', 'In Progress', 'wip', 'true'])(
      'a Project with the status %s fails, naming the file',
      (status) => {
        let dir = contentDir({ 'flowroll.mdx': project(status) })

        expect(() => getProjects({ dir })).toThrow(/flowroll\.mdx.*status/)
      }
    )
  })

  test('a Project is found by its slug, and an unknown slug finds nothing', () => {
    let project = (title: string) => `---
title: "${title}"
publishedAt: "2024-01-01"
summary: "About ${title}"
source: "https://github.com/MylesJPritchett/example"
---
`
    let dir = contentDir({
      'cravory.mdx': project('Cravory'),
      'battlesnake.mdx': project('Battlesnake'),
    })

    expect(getProject('cravory', { dir })?.title).toBe('Cravory')
    expect(getProject('recipease', { dir })).toBeUndefined()
  })
})

describe('Stack', () => {
  let projectWithStack = (stack: string) => `---
title: "Captivator"
publishedAt: "2026-10-22"
summary: "A Splash Page editor"
source: "https://github.com/MylesJPritchett/Captivator"
${stack}
---
`

  test('the Stack comes back in Layer order, whatever order the frontmatter uses', () => {
    let dir = contentDir({
      'captivator.mdx': projectWithStack(`stack:
  Testing: [Vitest, Playwright]
  Infra: [Netlify]
  Frontend: [Next.js, React]
  Data: [IndexedDB]
  AI: [Claude API]
  Backend: [Next.js Server Actions]`),
    })

    expect(getProject('captivator', { dir })?.stack).toEqual([
      { layer: 'Frontend', technologies: ['Next.js', 'React'] },
      { layer: 'Backend', technologies: ['Next.js Server Actions'] },
      { layer: 'Data', technologies: ['IndexedDB'] },
      { layer: 'AI', technologies: ['Claude API'] },
      { layer: 'Infra', technologies: ['Netlify'] },
      { layer: 'Testing', technologies: ['Vitest', 'Playwright'] },
    ])
  })

  test('a Project without a Stack has no stack field', () => {
    let dir = contentDir({ 'captivator.mdx': projectWithStack('') })

    expect(getProject('captivator', { dir })).not.toHaveProperty('stack')
  })

  test('empty and absent Layers are left out', () => {
    let dir = contentDir({
      'captivator.mdx': projectWithStack(`stack:
  Frontend: [Next.js]
  Backend: []
  Data:
  Testing: [Vitest]`),
    })

    expect(getProject('captivator', { dir })?.stack).toEqual([
      { layer: 'Frontend', technologies: ['Next.js'] },
      { layer: 'Testing', technologies: ['Vitest'] },
    ])
  })

  test('an unknown Layer fails, naming the file and the Layer', () => {
    let dir = contentDir({
      'captivator.mdx': projectWithStack('stack:\n  Frontend: [Next.js]\n  Mobile: [Swift]'),
    })

    expect(() => getProjects({ dir })).toThrow(/captivator\.mdx.*"Mobile"/)
  })

  test.each([
    ['a string', 'Frontend: Next.js'],
    ['a list with a non-string', 'Frontend: [Next.js, [React]]'],
    ['a map', 'Frontend: { framework: Next.js }'],
  ])('a Layer whose value is %s fails, naming the file and the Layer', (_, layer) => {
    let dir = contentDir({ 'captivator.mdx': projectWithStack(`stack:\n  ${layer}`) })

    expect(() => getProjects({ dir })).toThrow(/captivator\.mdx.*"Frontend"/)
  })

  test('a stack that is not a map of Layers fails, naming the file', () => {
    let dir = contentDir({ 'captivator.mdx': projectWithStack('stack: [Next.js, React]') })

    expect(() => getProjects({ dir })).toThrow(/captivator\.mdx.*stack/)
  })

  test('a Stack whose Layers are all empty counts as no Stack', () => {
    let dir = contentDir({ 'captivator.mdx': projectWithStack('stack:\n  Frontend: []') })

    expect(getProject('captivator', { dir })).not.toHaveProperty('stack')
  })
})

function post(title: string, publishedAt: string) {
  return `---
title: "${title}"
publishedAt: "${publishedAt}"
summary: "About ${title}"
---

${title} body.
`
}

describe('Posts', () => {
  test('a valid Post parses to its frontmatter and content', () => {
    let dir = contentDir({
      'jiu-jitsu.mdx': `---
title: "How Jiu Jitsu is Like Software Development"
publishedAt: "2024-07-15"
summary: "Similarities between BJJ & software"
image: "/jiu-jitsu/mat.png"
---

I have been practising Brazilian Jiu Jitsu for a few years.
`,
    })

    expect(getPosts({ dir })).toEqual([
      {
        slug: 'jiu-jitsu',
        title: 'How Jiu Jitsu is Like Software Development',
        publishedAt: '2024-07-15',
        summary: 'Similarities between BJJ & software',
        image: '/jiu-jitsu/mat.png',
        content: 'I have been practising Brazilian Jiu Jitsu for a few years.',
      },
    ])
  })

  test('a Post without an image has no image field', () => {
    let dir = contentDir({ 'first.mdx': post('First', '2024-05-29') })

    expect(getPosts({ dir })[0]).not.toHaveProperty('image')
  })

  test.each(['title', 'publishedAt', 'summary'])('a Post missing %s fails, naming the file', (field) => {
    let lines = post('First', '2024-05-29')
      .split('\n')
      .filter((line) => !line.startsWith(`${field}:`))
    let dir = contentDir({ 'first.mdx': lines.join('\n') })

    expect(() => getPosts({ dir })).toThrow(/first\.mdx/)
    expect(() => getPosts({ dir })).toThrow(new RegExp(field))
  })

  test('a Post with an unparseable date fails, naming the file', () => {
    let dir = contentDir({ 'first.mdx': post('First', '29/05/2024') })

    expect(() => getPosts({ dir })).toThrow(/first\.mdx.*publishedAt/)
  })

  test('a Post with malformed frontmatter fails, naming the file', () => {
    let dir = contentDir({ 'first.mdx': '---\ntitle: [unclosed\n---\n' })

    expect(() => getPosts({ dir })).toThrow(/first\.mdx/)
  })

  test('Posts come back newest first', () => {
    let dir = contentDir({
      'a-oldest.mdx': post('Oldest', '2023-01-10'),
      'b-newest.mdx': post('Newest', '2026-11-01'),
      'c-middle.mdx': post('Middle', '2024-07-15'),
    })

    expect(getPosts({ dir }).map((p) => p.title)).toEqual(['Newest', 'Middle', 'Oldest'])
  })

  test('a Post is found by its slug, and an unknown slug finds nothing', () => {
    let dir = contentDir({
      'jiu-jitsu.mdx': post('Jiu Jitsu', '2024-07-15'),
      'portfolio.mdx': post('Portfolio', '2024-05-29'),
    })

    expect(getPost('jiu-jitsu', { dir })?.title).toBe('Jiu Jitsu')
    expect(getPost('no-such-post', { dir })).toBeUndefined()
  })
})

describe('formatDate', () => {
  let originalTZ = process.env.TZ

  afterEach(() => {
    process.env.TZ = originalTZ
  })

  test.each(['UTC', 'America/Los_Angeles', 'Pacific/Kiritimati', 'Australia/Sydney'])(
    'gives the Sydney calendar date in en-AU when the machine is in %s',
    (timeZone) => {
      process.env.TZ = timeZone

      expect(formatDate('2024-04-06')).toBe('6 Apr 2024')
      expect(formatDate('2025-12-31')).toBe('31 Dec 2025')
    }
  )
})
