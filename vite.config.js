import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { join } from 'path'

export default defineConfig({
  plugins: [react(), visualizer({
    filename: join(process.cwd(), 'node_modules/.cache/visualizer/stats.html'),
    open: false,  // Set to false to avoid issues in CI/CD
    gzipSize: true,
    brotliSize: true,
  })],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
      ],
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'google-services': ['firebase/app', 'firebase/firestore', 'firebase/analytics'],
          'ai-integration': [],
          'ui-framework': ['framer-motion'],
        },
      },
    },
    reportCompressedSize: true,
    chunkSizeWarningLimit: 800,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
    exclude: ['firebase'],
  },
})
