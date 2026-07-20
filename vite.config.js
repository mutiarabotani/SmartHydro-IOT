/**
 * vite.config.js — konfigurasi bundler Vite untuk SmartHydro-AI Frontend.
 *
 * Untuk apa:
 * - plugin react     → mendukung JSX / React Fast Refresh
 * - plugin tailwind  → mengaktifkan Tailwind CSS v4 (@tailwindcss/vite)
 *
 * Dependency harus selaras dengan package.json (vite, @vitejs/plugin-react, @tailwindcss/vite).
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
