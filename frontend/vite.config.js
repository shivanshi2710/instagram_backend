import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/login': 'http://localhost:8000',
      '/users': 'http://localhost:8000',
      '/posts': 'http://localhost:8000',
      '/follow': 'http://localhost:8000',
    },
  },
})
