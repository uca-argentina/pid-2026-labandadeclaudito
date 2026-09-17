import path from 'node:path'
import { defineConfig } from 'vitest/config'

// Tests de integración: llaman a los endpoints contra la DB real (la de .env).
// Van aparte de `npm test` para que los unitarios sigan corriendo sin DB.
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    setupFiles: ['tests/setup.ts'],
    // Un archivo por vez: todos escriben en la misma DB
    fileParallelism: false,
    // DB remota + argon2 pueden tardar
    testTimeout: 30000,
    hookTimeout: 60000,
  },
})
