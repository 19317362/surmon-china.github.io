import path from 'path'
import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import UnheadVite from '@unhead/addons/vite'

// https://github.com/vitejs/vite/issues/5071
// https://github.com/vitejs/vite/pull/5535/files
// https://github.com/vitejs/vite/blob/main/packages/plugin-vue/src/main.ts#L102
// https://vue-loader.vuejs.org/zh/options.html#exposefilename
// https://github.com/vitejs/vite/issues/4646#issuecomment-905279744
// https://github.com/TeleworkInc/rollup-plugin-import-meta-url/blob/master/index.js
const resolveMetaUrl = (): Plugin => ({
  name: 'resolveMetaUrl',
  resolveImportMeta(property, chunk) {
    if (property === 'url') {
      // MARK: keep 'file://' + '/XXX'
      return `'file:///${path.relative(process.cwd(), chunk.moduleId)}'`
    }
  }
})

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [vue(), react(), resolveMetaUrl(), UnheadVite()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@examples': path.resolve(__dirname, 'examples')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    cssCodeSplit: false
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
        silenceDeprecations: ['mixed-decls']
      }
    }
  },
  ssr: {
    noExternal: ['vue-codemirror', '@videojs-player/vue', '@videojs-player/react', 'vue-touch-ripple']
  }
}))
