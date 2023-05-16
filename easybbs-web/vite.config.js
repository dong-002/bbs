import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,
    open: true,
    hmr: true,
    proxy: {
      "/api": {
        //代理 请求后端的接口
        target: 'http://localhost:7070/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname,'./src') //将 ./src变为@
    }
  }
})
