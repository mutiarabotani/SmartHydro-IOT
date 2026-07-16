/**
 * Konfigurasi Vite untuk project SmartHydro-AI Frontend.
 * - plugin react  : mendukung JSX / React
 * - plugin tailwind: mengaktifkan Tailwind CSS v4
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
