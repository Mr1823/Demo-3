import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@moxy/react-animate-text': path.resolve(__dirname, './src/components/AnimateText/AnimateText.jsx'),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      external: ['pdfjs-dist', 'pdfjs-dist/build/pdf.worker.entry'],
    },
  },
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      external: ['pdfjs-dist', 'pdfjs-dist/build/pdf.worker.entry'],
    },
  },
});
