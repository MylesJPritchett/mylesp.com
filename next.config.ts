import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Cravory's slug was recipease, and the Personal Portfolio Website
      // Project was removed. These come first so they win over /portfolio/:slug.
      ...['/projects', '/portfolio'].flatMap((prefix) => [
        { source: `${prefix}/recipease`, destination: '/projects/cravory', permanent: true },
        { source: `${prefix}/mylesp-personal-site`, destination: '/projects', permanent: true },
      ]),
      // Projects used to live under /portfolio.
      { source: '/portfolio', destination: '/projects', permanent: true },
      { source: '/portfolio/:slug', destination: '/projects/:slug', permanent: true },
    ]
  },
}

export default nextConfig
