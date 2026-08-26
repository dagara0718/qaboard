/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    // .env.local의 실제 Supabase 값이 테스트에 유입되면 dataAccess가 실 백엔드로 전환돼 네트워크 요청이 발생한다.
    // 테스트는 항상 MockRepository로 고정한다.
    env: { VITE_SUPABASE_URL: '', VITE_SUPABASE_ANON_KEY: '' },
    coverage: {
      exclude: ['ds-bundle/**', '.ds-sync/**', '.design-sync/**', 'node_modules/**'],
    },
  },
})
