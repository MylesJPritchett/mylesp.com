import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Projects used to live under /portfolio.
      { source: '/portfolio', destination: '/projects', permanent: true },
      { source: '/portfolio/:slug', destination: '/projects/:slug', permanent: true },
    ]
  },
}

export default nextConfig
