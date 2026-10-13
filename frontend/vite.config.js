import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      'instafrontend-ave8hhfgafemfuek.centralindia-01.azurewebsites.net',
    ],
    proxy: {
      '/login': 'https://instabackend-c5e2ejdkepdwddaa.centralindia-01.azurewebsites.net',
      '/users': 'https://instabackend-c5e2ejdkepdwddaa.centralindia-01.azurewebsites.net',
      '/posts': 'https://instabackend-c5e2ejdkepdwddaa.centralindia-01.azurewebsites.net',
      '/follow': 'https://instabackend-c5e2ejdkepdwddaa.centralindia-01.azurewebsites.net',
    },
  },
})
