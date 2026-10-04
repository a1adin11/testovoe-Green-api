import { fileURLToPath, URL } from 'node:url'

import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite'

const resolvePath = (path: string): string => fileURLToPath(new URL(path, import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), svgr()],
  resolve: {
    // Слои FSD, чтобы импорты не превращались в ../../..
    alias: {
      '@': resolvePath('./src'),
      '@app': resolvePath('./src/app'),
      '@pages': resolvePath('./src/pages'),
      '@widgets': resolvePath('./src/widgets'),
      '@features': resolvePath('./src/features'),
      '@entities': resolvePath('./src/entities'),
      '@shared': resolvePath('./src/shared'),
      '@assets': resolvePath('./src/assets'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Миксины доступны в любом *.module.scss без явного @use
        additionalData: (source: string, filename: string) =>
          filename.endsWith('.module.scss') ? `@use '@app/styles/mixins' as *;\n${source}` : source,
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
