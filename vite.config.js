import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost', // Your PHP server, usually Apache or XAMPP
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/FE2_DoAnNhom_KGC/src/includes'),
      },
    },
  },
});
