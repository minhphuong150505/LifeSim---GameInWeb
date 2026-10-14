/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'assets/ui/apple-touch-icon.png'],
      manifest: {
        name: 'LifeSim',
        short_name: 'LifeSim',
        description:
          'Luyện tập sơ cứu qua mô phỏng tình huống – Practice today, be ready tomorrow.',
        lang: 'vi',
        theme_color: '#E53935',
        background_color: '#FFF6EF',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/assets/ui/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/assets/ui/pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/assets/ui/pwa-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache everything needed to play offline (map tiles stay network-only).
        globPatterns: ['**/*.{js,css,html,svg,png,webp,mp3,woff2,glb}'],
        navigateFallback: '/index.html',
      },
    }),
  ],
  // three.js (lazy-loaded for the 3D mascot) is a single ~630 kB chunk.
  build: { chunkSizeWarningLimit: 700 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
