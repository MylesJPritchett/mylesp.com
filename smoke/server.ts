// Smoke test global setup: builds the site, starts it on a free local port and
// shares the base URL with the tests. Set SMOKE_SKIP_BUILD=1 to reuse an
// existing build (CI builds in an earlier step).
import { execFileSync, spawn, type ChildProcess } from 'node:child_process'
import { createServer } from 'node:net'
import type { TestProject } from 'vitest/node'

declare module 'vitest' {
  export interface ProvidedContext {
    baseUrl: string
  }
}

const nextCli = 'node_modules/next/dist/bin/next'

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    let server = createServer()
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      let address = server.address()
      if (address === null || typeof address === 'string') {
        server.close()
        reject(new Error('Could not find a free port'))
        return
      }
      server.close(() => resolve(address.port))
    })
  })
}

async function waitUntilUp(url: string, server: ChildProcess) {
  let deadline = Date.now() + 60_000
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`next start exited with code ${server.exitCode}`)
    }
    try {
      await fetch(url)
      return
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250))
    }
  }
  throw new Error(`Server at ${url} did not start within 60s`)
}

export default async function setup(project: TestProject) {
  if (process.env.SMOKE_SKIP_BUILD !== '1') {
    execFileSync(process.execPath, [nextCli, 'build'], { stdio: 'inherit' })
  }

  let port = await freePort()
  let baseUrl = `http://127.0.0.1:${port}`
  let server = spawn(
    process.execPath,
    [nextCli, 'start', '--port', String(port), '--hostname', '127.0.0.1'],
    { stdio: 'inherit' }
  )

  try {
    await waitUntilUp(baseUrl, server)
  } catch (error) {
    server.kill()
    throw error
  }

  project.provide('baseUrl', baseUrl)

  return async () => {
    if (server.exitCode !== null) return
    let exited = new Promise((resolve) => server.once('exit', resolve))
    server.kill()
    await exited
  }
}
