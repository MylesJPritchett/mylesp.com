import { ImageResponse } from 'next/og'
import { author, role } from 'app/site'

// The link preview card: the page title over Myles' name and role, or with no
// title, a site card leading with the name.
export function GET(request: Request) {
  let url = new URL(request.url)
  let title = url.searchParams.get('title')

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full justify-between bg-white text-neutral-900 p-20">
        <div tw="flex flex-col">
          <h1 tw="text-7xl font-bold tracking-tight m-0">{title || author}</h1>
          {!title && <p tw="text-4xl text-neutral-600 mt-6 mb-0">{role}</p>}
        </div>
        <div tw="flex w-full justify-between items-end text-3xl text-neutral-600">
          {title ? (
            <div tw="flex flex-col">
              <span tw="font-bold text-neutral-900">{author}</span>
              <span>{role}</span>
            </div>
          ) : (
            <span>Projects, Posts and Experience</span>
          )}
          <span>mylesp.com</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
