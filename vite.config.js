import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // 🔥 로컬 FastAPI 서버로 프록시
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
      '/static': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/report/': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      // --- 원격 서버 (EC2) — 주석 처리 ---
      // '/api': {
      //   target: 'http://3.38.48.153:8000',
      //   changeOrigin: true,
      //   rewrite: (p) => p.replace(/^\/api/, ''),
      // },
      // '/static': {
      //   target: 'http://3.38.48.153:8000',
      //   changeOrigin: true,
      // },
    },
  },
});
