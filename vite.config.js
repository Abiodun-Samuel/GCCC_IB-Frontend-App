// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import pkg from './package.json';

export default defineConfig({
  base: '/',

  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'animation-vendor': ['framer-motion', 'aos'],
        },
      },
    },
    minify: 'esbuild',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'aos', 'lucide-react'],
    exclude: ['virtual:pwa-register/react'],
  },

  plugins: [
    react({ fastRefresh: true }),

    svgr({
      svgrOptions: {
        icon: true,
        exportType: 'named',
        namedExport: 'ReactComponent',
      },
    }),

    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'icons/pwa-192x192.png',
        'icons/pwa-512x512.png',
        'images/logo/gccc.png',
      ],

      manifest: {
        name: 'GCCC Ibadan',
        short_name: 'GCCC Ib',
        description: "Glory Center Community Church, Ibadan, is a God ordained ministry, and the proof is in the signs and wonders following, fulfilled prophecies and transformed lives. Don't take our word for it, come see for yourself",
        theme_color: '#0998d5',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      workbox: {
        // Pre-cache ONLY the app shell — not every asset
        globPatterns: [
          '**/*.{css,html}',
          '**/react-vendor-*.js',      // ← dash not dot
          '**/animation-vendor-*.js',  // ← dash not dot
        ],

        runtimeCaching: [
          {
            // Laravel API — network first, fall back to cache
            urlPattern: /^https:\/\/api\.gcccibadan\.org\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'gccc-api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // JS chunks — cached on first route visit, not upfront
            urlPattern: /\/assets\/.*\.js$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gccc-js-chunks',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // CSS — cached on first load
            urlPattern: /\/assets\/.*\.css$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gccc-css-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          {
            // Images — lazy cached, capped to prevent unbounded growth
            urlPattern: /\.(?:png|jpg|jpeg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gccc-images',
              expiration: {
                maxEntries: 40,               // evicts oldest beyond this
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // SVGs — separate bucket, lighter cap
            urlPattern: /\.svg$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gccc-svg-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            // Fonts — long TTL, rarely change
            urlPattern: /\.(?:woff|woff2|ttf|eot)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gccc-fonts',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
              },
            },
          },
        ],
      },

      // Never enable in dev — causes module cache corruption
      devOptions: {
        enabled: false,
      },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});