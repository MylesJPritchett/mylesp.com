import Link from 'next/link'
import { formatDate, getPortfolioProjects } from 'app/portfolio/utils'

export function PortfolioProjects() {
  let allProjects = getPortfolioProjects()

  return (
    <div>
      {allProjects
        .sort((a, b) => {
          if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
            return -1
          }
          return 1
        })
        .map((project) => {
          return (
            <div
              key={project.slug}
              className="flex flex-col space-y-1 mb-4"
            >
              <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2 items-center">
                <p className="text-neutral-600 dark:text-neutral-400 mr-4 w-[100px] tabular-nums">
                  {formatDate(project.metadata.publishedAt, false)}
                </p>
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="text-neutral-900 dark:text-neutral-100 tracking-tight flex-1"
                >
                  {project.metadata.title}
                </Link>
                <div className="flex space-x-2">
                  <a
                    href={project.metadata.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-900 dark:text-neutral-100 tracking-tight mr-2"
                  >
                    &#128279;
                  </a>
                  <a
                    href={project.metadata.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-900 dark:text-neutral-100 tracking-tight"
                  >
                    &lt;/&gt;
                  </a>
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}
