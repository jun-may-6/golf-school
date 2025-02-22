import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]', // 해싱을 제거하고 원래 이름 유지
        entryFileNames: 'assets/[name].js', // 엔트리 파일 이름 유지
        chunkFileNames: 'assets/[name].js', // 청크 파일 이름 유지
      }
    }
  }
})
