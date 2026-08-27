import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const configuredHost = env.VITE_ALBUM_API_HOST || 'localhost:3000'
  const apiTarget = /^https?:\/\//.test(configuredHost)
    ? configuredHost
    : `http://${configuredHost}`

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname
      }
    },
    server: {
      port: 3001,
      proxy: {
        '/albums': {
          target: apiTarget,
          changeOrigin: true
        }
      }
    }
  }
})
