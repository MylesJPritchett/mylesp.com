// Who the Portfolio is for and where it lives, shared by metadata, structured
// data, the OG image and the RSS feed.
export const baseUrl = 'https://mylesp.com'

export const siteTitle = "Myles' Portfolio"

export const author = 'Myles Pritchett'

export const role = 'Fullstack Software Engineer'

export const siteDescription =
  `${author} is a ${role} in Sydney, open to new roles. ` +
  'Projects built with TypeScript, Next.js and Rust.'

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

/**
 * The page metadata for a Project or Post at the given path: an Open Graph
 * article and a large Twitter card, both using its preview image.
 */
export function articleMetadata(
  path: string,
  {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  }: { title: string; publishedAt: string; summary: string; image?: string }
) {
  let ogImage = imageUrl(title, image)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article' as const,
      publishedTime,
      url: `${baseUrl}${path}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [ogImage],
    },
  }
}
