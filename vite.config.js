import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    define: {
      __API_URL__: JSON.stringify(env.VITE_API_URL || 'https://st-backend-tau.vercel.app/api'),
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'https://st-backend-tau.vercel.app',
          changeOrigin: true,
          secure: true,
        }
      }
    }
  }
})
