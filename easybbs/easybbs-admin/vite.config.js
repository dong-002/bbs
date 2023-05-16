import { defineConfig } from 'vite'
import {fileURLToPath,URL} from 'node:url'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8081,
    open: true,
    hmr: true,
    proxy: {
      '/api': {
        target: 'http://localhost:7071/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src',import.meta.url))
    }
  }
})
