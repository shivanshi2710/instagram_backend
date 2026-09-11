import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/login': 'http://backend:8000',
      '/users': 'http://backend:8000',
      '/posts': 'http://backend:8000',
      '/follow': 'http://backend:8000',
    },
  },
})
