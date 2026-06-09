import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Financial-Tool-Hub/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
