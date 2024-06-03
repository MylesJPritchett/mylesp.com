import Link from 'next/link'
import { formatDate, getPortfolioProjects } from 'app/portfolio/utils'

export function PortfolioProjects() {
  let allProjects = getPortfolioProjects()

  return (
    <div>
      {allProjects
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((project) => (
          <div className="flex space-x-">
            <Link
              key={project.slug}
              className="flex flex-col items-center"
              href={`/portfolio/${project.slug}`}
            >
              <p className="text-neutral-600 dark:text-neutral-400 w-[100px] mr-4 tabular-nums">
                {formatDate(project.metadata.publishedAt, false)}
              </p>
            </Link>
            <Link
              key={`${project.slug}-link`}
              className="flex flex-col items-center"
              href={`/portfolio/${project.slug}`}
            >
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight mr-4 ">
                {project.metadata.title}
              </p>
            </Link>
            <Link
              key={`${project.slug}-link`}
              className="flex flex-col items-center"
              href={project.metadata.link}
            >
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight mr-4">
                &#128279;
              </p>
            </Link>
            <Link
              key={`${project.slug}-source`}
              className="flex flex-col items-center"
              href={project.metadata.source}
            >
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight align-right">
                &lt;/&gt;
              </p>
            </Link>
          </div>
        ))
      }
    </div >
  )
}
