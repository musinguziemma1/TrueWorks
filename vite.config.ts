import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    hmr: {
      overlay: false,
    },
    watch: {
      ignored: ['**/dist/**', '**/node_modules/**', '**/.git/**'],
    },
  },
  css: {
    devSourcemap: false,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'vendor-recharts';
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('convex')) return 'vendor-convex';
            if (id.includes('react-router-dom') || id.includes('react-router')) return 'vendor-router';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
            if (id.includes('@radix-ui')) return 'vendor-radix';
            return 'vendor';
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react-is', 'react', 'react-dom', 'react-router', 'react-router-dom', 'recharts', 'framer-motion', 'lucide-react'],
  },
})
