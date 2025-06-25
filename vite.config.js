// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     allowedHosts: ['d780-118-69-182-144.ngrok-free.app',
//       '4cd2-118-69-70-166.ngrok-free.app'],
//     port: 3000  }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: [
      'd780-118-69-182-144.ngrok-free.app',
      '4cd2-118-69-70-166.ngrok-free.app'
    ]
  },
  // 👇 QUAN TRỌNG: Vite fallback cho SPA (BrowserRouter)
  resolve: {
    alias: {
      '@': '/src',
    }
  },
  base: './', // nếu build ra static, tránh lỗi đường dẫn
  build: {
    rollupOptions: {
      input: 'index.html'
    }
  }
})
