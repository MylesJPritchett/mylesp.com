import { getPosts } from 'app/content'
import { rssFeed } from './feed'

export async function GET() {
  return new Response(rssFeed(getPosts()), {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}
