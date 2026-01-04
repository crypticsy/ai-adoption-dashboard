import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ai-adoption-dashboard/',
  optimizeDeps: {
    include: ['react-globe.gl', 'three', 'lucide-react'],
  },
  resolve: {
    alias: {
      'three': 'three',
    },
  },
})
