import type { Stack } from 'app/content'

/**
 * A Project's Stack drawn as a vertical pile of Layers, top to bottom. The rows
 * share one grid, so the Layer column is as wide as its longest label.
 */
export function StackDiagram({ stack }: { stack?: Stack }) {
  if (!stack) return null

  return (
    <dl
      aria-label="Stack"
      className="mb-8 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-3 gap-y-1 text-sm"
    >
      {stack.map(({ layer, technologies }) => (
        <div
          key={layer}
          className="col-span-2 grid grid-cols-subgrid items-baseline rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2"
        >
          <dt className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {layer}
          </dt>
          <dd className="min-w-0">
            <ul className="flex flex-wrap gap-x-3 gap-y-1 text-neutral-800 dark:text-neutral-200">
              {technologies.map((technology) => (
                <li key={technology} className="break-words">
                  {technology}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  )
}
