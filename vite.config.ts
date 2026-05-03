import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || 'http://localhost:5173').replace(
    /\/$/,
    ''
  )

  return {
    plugins: [
      react(),
      {
        name: 'html-site-url-fallback',
        transformIndexHtml(html: string) {
          return html.replaceAll('__SITE_URL__', siteUrl)
        },
      },
    ],
  }
})
