import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.tests.ts'],
    testTimeout: 1000,
  },
})
