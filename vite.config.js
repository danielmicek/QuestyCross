import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import {VitePWA} from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [tailwindcss(), react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'QuestyCross',
        short_name: 'QuestyCross',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          { src: './coin.png', sizes: '192x192', type: 'image/png' },
          { src: './coin.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      devOptions: { enabled: true }
    })
  ],
  server: {
    allowedHosts: [
      "accomplishable-aleshia-mulishly.ngrok-free.dev"
    ],
  },
})
