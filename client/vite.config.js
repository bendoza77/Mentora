import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    // Raise warning threshold — recharts + router are legitimately large
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core — changes least often, cached the longest
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/scheduler/')
          ) return 'vendor-react';

          // Router
          if (
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/@remix-run/')
          ) return 'vendor-router';

          // Charts — only needed on /analytics & /exam pages
          if (
            id.includes('node_modules/recharts') ||
            id.includes('node_modules/d3-') ||
            id.includes('node_modules/victory-vendor')
          ) return 'vendor-charts';

          // Stripe — only needed on /purchase
          if (id.includes('node_modules/@stripe/')) return 'vendor-stripe';

          // i18n
          if (
            id.includes('node_modules/i18next') ||
            id.includes('node_modules/react-i18next')
          ) return 'vendor-i18n';

          // Icons — large static library, very cache-friendly
          if (id.includes('node_modules/lucide-react')) return 'vendor-icons';
        },
      },
    },
  },

  // Pre-bundle these on dev-server start so first HMR is instant
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'i18next',
      'react-i18next',
      'lucide-react',
      'clsx',
    ],
  },
})
