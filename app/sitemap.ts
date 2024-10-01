import { getBlogPosts } from 'app/blog/utils'
import { getPortfolioProjects } from './portfolio/utils'

export const baseUrl = 'https://mylesp.com'

export default async function sitemap() {
  let blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  let projects = getPortfolioProjects().map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: project.metadata.publishedAt,
  }))


  let routes = ['', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  let projectRoutes = ['', '/portfolio'].map((projectRoute) => ({
    url: `${baseUrl}${projectRoute}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs, ...projectRoutes, ...projects]
}
