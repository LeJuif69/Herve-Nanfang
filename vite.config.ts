import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function webhookRelayDevPlugin(): Plugin {
  const attachMiddleware = (middlewares: any) => {
    middlewares.use('/api/webhook-relay', async (req: any, res: any) => {
      try {
        const chunks: Buffer[] = []
        for await (const chunk of req) {
          chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
        }
        const rawBody = Buffer.concat(chunks).toString('utf8')
        req.body = rawBody ? JSON.parse(rawBody) : {}

        const resWrapper = {
          statusCode: 200,
          setHeader: (name: string, value: string) => res.setHeader(name, value),
          status(code: number) {
            this.statusCode = code
            res.statusCode = code
            return this
          },
          json(data: unknown) {
            if (!res.headersSent) {
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
            }
            res.end(JSON.stringify(data))
            return this
          },
          end(body?: string) {
            res.end(body)
            return this
          },
        }

        const relayModuleUrl = pathToFileURL(path.resolve(process.cwd(), 'api/webhook-relay.js')).href
        const mod = await import(/* @vite-ignore */ relayModuleUrl)
        await mod.default(req, resWrapper)
      } catch (err) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(
          JSON.stringify({
            success: false,
            status: 500,
            error: err instanceof Error ? err.message : 'Erreur interne du relais Webhook local',
          }),
        )
      }
    })
  }

  return {
    name: 'hn-webhook-relay-dev',
    configureServer(server) {
      attachMiddleware(server.middlewares)
    },
    configurePreviewServer(server) {
      attachMiddleware(server.middlewares)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), webhookRelayDevPlugin()],
  resolve: {
    preserveSymlinks: true,
  },
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
      ignored: ['**/docs/**', '**/photos/**', '**/scripts/**', '**/api/**', '**/*.md', '**/dist/**'],
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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase'
          }
          if (id.includes('src/data/articles')) {
            return 'articles-data'
          }
          if (
            id.includes('src/lib/admin-store') ||
            id.includes('src/lib/social-generator') ||
            id.includes('src/lib/generated-uploads-media') ||
            id.includes('src/lib/campaign-distribution')
          ) {
            return 'admin-store'
          }
        },
      },
    },
  },
})
