// Who the Portfolio is for and where it lives, shared by metadata, structured
// data, the OG image and the RSS feed.
export const baseUrl = 'https://mylesp.com'

export const siteTitle = "Myles' Portfolio"

export const author = 'Myles Pritchett'

export const role = 'Fullstack Software Engineer'

export const siteDescription =
  `${author} is a ${role} in Sydney, open to new roles. ` +
  'See the projects he has built in TypeScript, Next.js and Rust.'

/** The author of every Project and Post, as schema.org structured data. */
export const authorPerson = { '@type': 'Person', name: author, url: baseUrl }

/**
 * The absolute URL of a Project or Post's preview image: its own image if it
 * has one, otherwise an OG card for its title. Metadata and structured data
 * both use this, so they always agree.
 */
export function imageUrl(title: string, image?: string) {
  return image
    ? new URL(image, baseUrl).href
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`
}
