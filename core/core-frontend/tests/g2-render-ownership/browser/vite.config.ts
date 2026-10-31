import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  server: {
    host: '127.0.0.1',
    port: 7093,
    strictPort: true,
    fs: { allow: [fileURLToPath(new URL('../../..', import.meta.url))] }
  },
  build: { outDir: '/tmp/dataease-g2-ownership-browser-r001', emptyOutDir: true }
})
