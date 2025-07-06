import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const API_URL = "https://soback-dwgchhasgecnfqc6.canadacentral-01.azurewebsites.net";


export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: `${API_URL}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
