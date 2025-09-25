import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  base: "/webgme/",
  plugins: [
    tailwindcss(),
    nodePolyfills(),
  ],
})