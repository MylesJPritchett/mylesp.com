# Myles' Portfolio Blog

This is a porfolio site complete with a blog. Includes:

- MDX and Markdown support
- Optimized for SEO (sitemap, robots, JSON-LD schema)
- RSS Feed
- Dynamic OG images
- Syntax highlighting
- Tailwind v4
- Vercel Speed Insights / Web Analytics
- Geist font

## Live URL

<https://mylesp.com>

## Development

Uses pnpm (version pinned in `package.json`) and Node 24.

- `pnpm dev`: run the site locally
- `pnpm typecheck`: generate route types and type check
- `pnpm test:unit`: unit tests (`app/**/*.test.ts`)
- `pnpm test:smoke`: build the site, start it on a free port and run the smoke tests in `smoke/` against it. Set `SMOKE_SKIP_BUILD=1` to reuse an existing build.
- `pnpm test`: unit and smoke tests
