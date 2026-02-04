import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
const API_URL = process.env.VITE_API_URL || 'http://localhost:5000'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  // Dev server proxy to forward /api requests to backend during development
  server: {
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true,
        secure: false
      }
    }
  }
})
