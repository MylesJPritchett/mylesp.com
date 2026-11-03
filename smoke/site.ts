// The pages the built site actually serves, read from its sitemap, so tests
// over "every Project" or "every Post" follow whatever content the build has.
import { get } from './http'

async function sitemapPaths() {
  let page = await get('/sitemap.xml')
  return page.html
    .querySelectorAll('loc')
    .map((loc) => new URL(loc.text.trim()).pathname)
}

/** Paths of every Project page, e.g. /projects/battlesnake. */
export async function projectPaths() {
  return (await sitemapPaths()).filter((path) => /^\/projects\/[^/]+$/.test(path))
}

/** Paths of every Post page, e.g. /blog/developing-a-portfolio-website. */
export async function postPaths() {
  return (await sitemapPaths()).filter((path) => /^\/blog\/[^/]+$/.test(path))
}
