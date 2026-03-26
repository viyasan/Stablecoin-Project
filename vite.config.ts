import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/llama-stablecoins': {
        target: 'https://stablecoins.llama.fi',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/llama-stablecoins/, ''),
      },
      '/api/llama-yields': {
        target: 'https://yields.llama.fi',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/llama-yields/, ''),
      },
      '/api/llama': {
        target: 'https://api.llama.fi',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/llama/, ''),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
})
