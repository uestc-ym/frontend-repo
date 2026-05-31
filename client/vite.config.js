import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
const pathResolve = (dir) => {
  return resolve(__dirname, '.', dir)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000'
      }
    },
    // historyApiFallback: true
  },
  resolve: {
    alias: {
      '@': pathResolve('src')
    }
  },
})
