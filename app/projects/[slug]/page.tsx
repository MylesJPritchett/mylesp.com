import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { InProgress } from 'app/components/in-progress'
import { StackDiagram } from 'app/components/stack-diagram'
import { formatDate, getProject, getProjects } from 'app/content'
import { authorPerson, baseUrl, imageUrl } from 'app/site'

export async function generateStaticParams() {
  let projects = getProjects()

  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: PageProps<'/projects/[slug]'>) {
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
  let ogImage = imageUrl(title, image)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/projects/${project.slug}`,
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

export default async function ProjectPage({ params }: PageProps<'/projects/[slug]'>) {
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
            '@type': 'SoftwareSourceCode',
            name: project.title,
            headline: project.title,
            datePublished: project.publishedAt,
            dateModified: project.publishedAt,
            description: project.summary,
            image: imageUrl(project.title, project.image),
            url: `${baseUrl}/projects/${project.slug}`,
            codeRepository: project.source,
            author: authorPerson,
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
      <StackDiagram stack={project.stack} />
      <article className="prose">
        <CustomMDX source={project.content} />
      </article>
    </section>
  )
}
