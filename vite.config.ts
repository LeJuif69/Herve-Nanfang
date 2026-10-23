import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Autorise le proxy de prévisualisation (sous-domaine *.e2b.app)
    allowedHosts: true,
    cors: true,
    // La documentation, les scripts et les photos ne déclenchent plus de
    // rechargement de page : seuls les fichiers de l'application sont surveillés.
    watch: {
      ignored: ['**/docs/**', '**/photos/**', '**/scripts/**', '**/*.md', '**/dist/**'],
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    allowedHosts: true,
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    manifest: true,
  },
})
