import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    passWithNoTests: true,
    projects: [
      {
        test: {
          name: 'unit',
          include: ['app/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'smoke',
          include: ['smoke/**/*.test.ts'],
          globalSetup: ['smoke/server.ts'],
          hookTimeout: 300_000,
        },
      },
    ],
  },
})
