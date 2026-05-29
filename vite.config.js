import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { isPublishedDate, parseFrontmatter } from './src/utils/parseMd.js'

const DOMAIN = 'https://drexlerwealth.com'
const STATIC_ROUTES = ['/', '/strategy-lab', '/insights']

function generateSitemap() {
  const blogDir = path.resolve('content/blog')
  const urls = STATIC_ROUTES.map(
    (route) => `  <url>\n    <loc>${DOMAIN}${route}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n  </url>`
  )

  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'))
    for (const file of files) {
      const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8')
      const { data } = parseFrontmatter(raw)
      if (!isPublishedDate(data.date)) continue

      const slug = file.replace(/\.md$/, '')
      urls.push(
        `  <url>\n    <loc>${DOMAIN}/insights/${slug}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n  </url>`
      )
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
  fs.mkdirSync('public', { recursive: true })
  fs.writeFileSync(path.resolve('public/sitemap.xml'), xml)
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'sitemap-generator',
      closeBundle() {
        generateSitemap()
      },
    },
  ],
})
