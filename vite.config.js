import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/invidious': {
        target: 'https://inv.nadeko.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/invidious/, ''),
      },
      '/api/invidious2': {
        target: 'https://invidious.nerdvpn.de',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/invidious2/, ''),
      },
      '/api/piped': {
        target: 'https://pipedapi.kavin.rocks',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/piped/, ''),
      },
    }
  }
})
