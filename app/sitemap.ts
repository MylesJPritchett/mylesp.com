import { getPosts, getProjects } from 'app/content'
import { baseUrl } from 'app/site'

export default async function sitemap() {
  let today = new Date().toISOString().split('T')[0]

  let routes = ['', '/projects', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: today,
  }))

  let projects = getProjects().map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.publishedAt,
  }))

  let posts = getPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt,
  }))

  return [...routes, ...projects, ...posts]
}
