import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Nom du dépôt GitHub : l'app sera servie sur https://<compte>.github.io/LSFolio/
  base: '/LSFolio/',
  plugins: [
    vue(),
    VitePWA({
      // Service worker écrit à la main (src/sw.ts) pour pouvoir mettre les vidéos en cache.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
      },
      manifest: {
        name: 'LSFolio – Apprendre la LSF',
        short_name: 'LSFolio',
        description: 'Apprendre la Langue des Signes Française en vidéo : thèmes, favoris et quiz.',
        lang: 'fr',
        theme_color: '#5b4bdb',
        background_color: '#f6f5fb',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
