import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	  server: {
    allowedHosts: [
      'thekarigarstop.vikas.rocks',
      'localhost',
    ],
    port: 5150,
  },
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion': ['framer-motion'],
          'icons': ['react-icons']
        }
      }
    }
  }
})
