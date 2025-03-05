import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Explicitní importování s typem any, aby se TypeScript nebouřil
import * as path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Přidej toto pro GitHub Pages - název tvého repositáře
  base: '/goldsignals/',
  // Přidej alias pro jednodušší importy
  resolve: {
    alias: {
      '@': path.resolve('./src')
    }
  }
})