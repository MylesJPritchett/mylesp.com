import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { InProgress } from 'app/components/in-progress'
import { formatDate, getProject, getProjects } from 'app/content'
import { baseUrl } from 'app/sitemap'

export async function generateStaticParams() {
  let projects = getProjects()

  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: PageProps<'/portfolio/[slug]'>) {
  let { slug } = await params
  let project = getProject(slug)
  if (!project) {
    return
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = project
  let ogImage = image ? image : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/portfolio/${project.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Portfolio({ params }: PageProps<'/portfolio/[slug]'>) {
  let { slug } = await params
  let project = getProject(slug)

  if (!project) {
    notFound()
  }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'PortfolioProject',
            headline: project.title,
            datePublished: project.publishedAt,
            dateModified: project.publishedAt,
            description: project.summary,
            image: project.image
              ? `${baseUrl}${project.image}`
              : `/og?title=${encodeURIComponent(project.title)}`,
            url: `${baseUrl}/portfolio/${project.slug}`,
            author: {
              '@type': 'Person',
              name: "Myles' Portfolio",
            },
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {project.title}
        {project.inProgress && <InProgress />}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(project.publishedAt)}
        </p>
      </div>
      <article className="prose">
        <CustomMDX source={project.content} />
      </article>
    </section>
  )
}
