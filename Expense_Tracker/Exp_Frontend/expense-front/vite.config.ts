import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Ensures Vite knows how to resolve private paths
      'date-fns': path.resolve(__dirname, 'node_modules/date-fns'),
    },
  },
  optimizeDeps: {
    include: ['date-fns/_lib/format/longFormatters'], // Add this
  },
});