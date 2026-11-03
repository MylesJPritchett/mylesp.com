// The one place Project and Post MDX is read from disk. Frontmatter is parsed
// as YAML and validated; invalid content throws an error naming the file, which
// fails the static build.
import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'yaml'

export type Project = {
  slug: string
  title: string
  publishedAt: string
  summary: string
  source: string
  link?: string
  image?: string
  /** Featured Project rank: lower comes first. Unranked Projects follow. */
  order?: number
  /** Still being actively built. Set with `status: in-progress`. */
  inProgress: boolean
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
  /**
   * Directory of MDX files to read. Defaults to the site's real content, or
   * for Projects to PROJECTS_DIR when set (the smoke tests build with it).
   */
  dir?: string
}

const PROJECTS_DIR = path.join(process.cwd(), 'app', 'projects', 'projects')
const POSTS_DIR = path.join(process.cwd(), 'app', 'blog', 'posts')

type Frontmatter = {
  required(key: string): string
  date(key: string): string
  optional<K extends string>(key: K): { [P in K]?: string }
  optionalInteger<K extends string>(key: K): { [P in K]?: number }
  oneOf<V extends string>(key: string, allowed: readonly V[]): V | undefined
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
    optionalInteger(key) {
      let value = data[key]
      if (value === undefined || value === null) return {} as { [P in typeof key]?: number }
      if (typeof value !== 'number' || !Number.isInteger(value)) {
        fail(`"${key}" must be a whole number, got "${String(value)}"`)
      }
      return { [key]: value } as { [P in typeof key]?: number }
    },
    oneOf(key, allowed) {
      let value = present(key)
      if (value === undefined) return undefined
      return allowed.find((option) => option === value) ??
        fail(`"${key}" must be one of ${allowed.map((option) => `"${option}"`).join(', ')}, got "${value}"`)
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

/**
 * The order Projects are shown in: Featured Projects by ascending order, then
 * the rest newest first. Ties break by slug.
 */
function projectOrder(a: Project, b: Project) {
  if (a.order !== undefined && b.order !== undefined) {
    return a.order - b.order || a.slug.localeCompare(b.slug)
  }
  if (a.order !== undefined) return -1
  if (b.order !== undefined) return 1
  return newestFirst(a, b)
}

export function getProjects({
  dir = process.env.PROJECTS_DIR || PROJECTS_DIR,
}: ContentOptions = {}): Project[] {
  return readMDX(dir)
    .map(({ slug, frontmatter, content }) => ({
      slug,
      title: frontmatter.required('title'),
      publishedAt: frontmatter.date('publishedAt'),
      summary: frontmatter.required('summary'),
      source: frontmatter.required('source'),
      ...frontmatter.optional('link'),
      ...frontmatter.optional('image'),
      ...frontmatter.optionalInteger('order'),
      inProgress: frontmatter.oneOf('status', ['in-progress']) === 'in-progress',
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
