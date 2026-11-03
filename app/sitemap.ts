import { getPosts, getProjects } from 'app/content'

export const baseUrl = 'https://mylesp.com'

export default async function sitemap() {
  let blogs = getPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt,
  }))

  let projects = getProjects().map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: project.publishedAt,
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
