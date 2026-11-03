import { describe, expect, test } from 'vitest'
import { articleMetadata } from './site'

describe('articleMetadata', () => {
  test('describes a Project or Post as an article, with its own image', () => {
    let metadata = articleMetadata('/projects/battlesnake', {
      title: 'Battlesnake AI',
      publishedAt: '2024-04-06',
      summary: 'An AI for Battlesnake',
      image: '/battlesnake/board.png',
    })

    expect(metadata).toEqual({
      title: 'Battlesnake AI',
      description: 'An AI for Battlesnake',
      openGraph: {
        title: 'Battlesnake AI',
        description: 'An AI for Battlesnake',
        type: 'article',
        publishedTime: '2024-04-06',
        url: 'https://mylesp.com/projects/battlesnake',
        images: [{ url: 'https://mylesp.com/battlesnake/board.png' }],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Battlesnake AI',
        description: 'An AI for Battlesnake',
        images: ['https://mylesp.com/battlesnake/board.png'],
      },
    })
  })

  test('falls back to an OG card for the title when there is no image', () => {
    let metadata = articleMetadata('/blog/jiu-jitsu', {
      title: 'Jiu Jitsu & me',
      publishedAt: '2024-07-15',
      summary: 'On the mats',
    })

    expect(metadata.openGraph.url).toBe('https://mylesp.com/blog/jiu-jitsu')
    expect(metadata.openGraph.images).toEqual([
      { url: 'https://mylesp.com/og?title=Jiu%20Jitsu%20%26%20me' },
    ])
    expect(metadata.twitter.images).toEqual([
      'https://mylesp.com/og?title=Jiu%20Jitsu%20%26%20me',
    ])
  })
})
