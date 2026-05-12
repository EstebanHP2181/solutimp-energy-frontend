import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // forks pool can exit immediately without running tests in some Linux/sandbox setups
    pool: 'threads',
  },
})
