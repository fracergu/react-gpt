import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tsconfigPaths()],
  publicDir: 'public',
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['src/setupTests.ts'],
    coverage: {
      provider: 'c8',
      exclude: ['src/**/*.test.tsx', 'src/models', 'src/enums', 'src/utils'],
    },
  },
})
