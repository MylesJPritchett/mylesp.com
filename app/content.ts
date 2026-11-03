// The one place Project and Post MDX is read from disk. Frontmatter is parsed
// as YAML and validated; invalid content throws an error naming the file, which
// fails the static build.
import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'yaml'

/** The fixed set of Layers, in the order a Stack is shown. */
export const LAYERS = ['Frontend', 'Backend', 'Data', 'AI', 'Infra', 'Testing'] as const

export type Layer = (typeof LAYERS)[number]

/** A Project's Stack: the Layers it uses, in Layer order, each with its technologies. */
export type Stack = { layer: Layer; technologies: string[] }[]

export type Project = {
  slug: string
  title: string
  publishedAt: string
  summary: string
  source: string
  link?: string
  image?: string
  stack?: Stack
  content: string
}

export type Post = {
  slug: string
  title: string
  publishedAt: string
  summary: string
  image?: string
  content: string
}

export type ContentOptions = {
  /** Directory of MDX files to read. Defaults to the site's real content. */
  dir?: string
}

const PROJECTS_DIR = path.join(process.cwd(), 'app', 'portfolio', 'projects')
const POSTS_DIR = path.join(process.cwd(), 'app', 'blog', 'posts')

type Frontmatter = {
  required(key: string): string
  date(key: string): string
  optional<K extends string>(key: K): { [P in K]?: string }
  stack(): { stack?: Stack }
}

type MDXFile = {
  slug: string
  frontmatter: Frontmatter
  content: string
}

function isCalendarDate(value: string) {
  let match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false
  let [year, month, day] = match.slice(1).map(Number)
  let date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  )
}

function readFrontmatter(file: string, data: Record<string, unknown>): Frontmatter {
  let fail = (message: string): never => {
    throw new Error(`${file}: ${message}`)
  }
  let present = (key: string) => {
    let value = data[key]
    return value === undefined || value === null || value === '' ? undefined : String(value)
  }

  return {
    required(key) {
      return present(key) ?? fail(`missing required frontmatter field "${key}"`)
    },
    date(key) {
      let value = this.required(key)
      return isCalendarDate(value) ? value : fail(`"${key}" must be a date as YYYY-MM-DD, got "${value}"`)
    },
    optional(key) {
      let value = present(key)
      return (value === undefined ? {} : { [key]: value }) as { [P in typeof key]?: string }
    },
    stack() {
      let value = data.stack
      if (value === undefined || value === null) return {}
      if (typeof value !== 'object' || Array.isArray(value)) {
        return fail(`"stack" must map each Layer to a list of technologies`)
      }
      let layers = value as Record<string, unknown>
      for (let [layer, technologies] of Object.entries(layers)) {
        if (!(LAYERS as readonly string[]).includes(layer)) {
          fail(`unknown Layer "${layer}" in "stack"; use ${LAYERS.join(', ')}`)
        }
        let isList =
          technologies === null ||
          (Array.isArray(technologies) && technologies.every((t) => typeof t === 'string'))
        if (!isList) fail(`Layer "${layer}" in "stack" must be a list of technology names`)
      }
      let stack = LAYERS.flatMap((layer) => {
        let technologies = layers[layer] as string[] | null | undefined
        return technologies?.length ? [{ layer, technologies }] : []
      })
      return stack.length ? { stack } : {}
    },
  }
}

function parseYAML(file: string, yaml: string): Record<string, unknown> {
  let data: unknown
  try {
    data = parse(yaml)
  } catch (error) {
    throw new Error(`${file}: frontmatter is not valid YAML: ${(error as Error).message}`)
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error(`${file}: frontmatter must be a set of fields`)
  }
  return data as Record<string, unknown>
}

function readMDX(dir: string): MDXFile[] {
  return fs
    .readdirSync(dir)
    .filter((file) => path.extname(file) === '.mdx')
    .sort()
    .map((name) => {
      let file = path.join(dir, name)
      let text = fs.readFileSync(file, 'utf-8')
      let match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)
      if (!match) {
        throw new Error(`${file}: no frontmatter block found`)
      }
      return {
        slug: path.basename(name, '.mdx'),
        frontmatter: readFrontmatter(file, parseYAML(file, match[1])),
        content: text.slice(match[0].length).trim(),
      }
    })
}

type Dated = { publishedAt: string; slug: string }

// publishedAt is validated as YYYY-MM-DD, so string order is date order.
function newestFirst(a: Dated, b: Dated) {
  return b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug)
}

/** The order Projects are shown in. */
function projectOrder(a: Project, b: Project) {
  return newestFirst(a, b)
}

export function getProjects({ dir = PROJECTS_DIR }: ContentOptions = {}): Project[] {
  return readMDX(dir)
    .map(({ slug, frontmatter, content }) => ({
      slug,
      title: frontmatter.required('title'),
      publishedAt: frontmatter.date('publishedAt'),
      summary: frontmatter.required('summary'),
      source: frontmatter.required('source'),
      ...frontmatter.optional('link'),
      ...frontmatter.optional('image'),
      ...frontmatter.stack(),
      content,
    }))
    .sort(projectOrder)
}

export function getProject(slug: string, options?: ContentOptions): Project | undefined {
  return getProjects(options).find((project) => project.slug === slug)
}

export function getPosts({ dir = POSTS_DIR }: ContentOptions = {}): Post[] {
  return readMDX(dir)
    .map(({ slug, frontmatter, content }) => ({
      slug,
      title: frontmatter.required('title'),
      publishedAt: frontmatter.date('publishedAt'),
      summary: frontmatter.required('summary'),
      ...frontmatter.optional('image'),
      content,
    }))
    .sort(newestFirst)
}

export function getPost(slug: string, options?: ContentOptions): Post | undefined {
  return getPosts(options).find((post) => post.slug === slug)
}

const dateFormat = new Intl.DateTimeFormat('en-AU', {
  timeZone: 'Australia/Sydney',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/** Formats a YYYY-MM-DD date as Sydney sees it, e.g. "6 Apr 2024". */
export function formatDate(date: string): string {
  let [year, month, day] = date.split('-').map(Number)
  // Noon UTC falls on the same calendar day in Sydney (UTC+10 or +11).
  return dateFormat.format(new Date(Date.UTC(year, month - 1, day, 12)))
}
