import Link from 'next/link'
import { formatDate, getProjects } from 'app/content'
import { InProgress } from 'app/components/in-progress'
import { StackList } from 'app/components/stack-list'

export function ProjectList() {
  let allProjects = getProjects()

  return (
    <div>
      {allProjects.map((project) => {
        return (
          <div
            key={project.slug}
            className="flex flex-col space-y-1 mb-4"
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2 items-center">
              <p className="text-neutral-600 dark:text-neutral-400 mr-4 w-[100px] tabular-nums">
                {formatDate(project.publishedAt)}
              </p>
              <Link
                href={`/projects/${project.slug}`}
                className="text-neutral-900 dark:text-neutral-100 tracking-tight flex-1"
              >
                {project.title}
                {project.inProgress && <InProgress />}
              </Link>
              <div className="flex space-x-2">
                {project.link &&
                  (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Live site for ${project.title}`}
                      className="text-neutral-900 dark:text-neutral-100 tracking-tight mr-2"
                    >
                      <span aria-hidden="true">&#128279;</span>
                    </a>
                  )
                }
                <a
                  href={project.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Source code for ${project.title}`}
                  className="text-neutral-900 dark:text-neutral-100 tracking-tight"
                >
                  <span aria-hidden="true">&lt;/&gt;</span>
                </a>
              </div>
            </div>
            <StackList title={project.title} stack={project.stack} />
          </div>
        )
      })}
    </div>
  )
}
