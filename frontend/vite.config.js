import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    origin: 'http://0.0.0.0:3000',
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:5000/'),
    'import.meta.env.VITE_API_KEY': JSON.stringify(process.env.VITE_API_KEY || 'default-secret-key')
  }
})