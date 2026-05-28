import { parseFrontmatter } from './parseMd'

const modules = import.meta.glob('../../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function parseDate(dateStr) {
  return new Date(dateStr)
}

export function getAllArticles() {
  const articles = Object.entries(modules).map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw)
    const slug = path.replace(/^.*\//, '').replace(/\.md$/, '')
    return {
      slug,
      title: data.title || slug,
      date: data.date || '',
      description: data.description || '',
      readTime: data.readTime || '',
      content,
      dateObj: parseDate(data.date || '1970-01-01'),
    }
  })

  return articles.sort((a, b) => b.dateObj - a.dateObj)
}

export function getArticleBySlug(slug) {
  return getAllArticles().find((a) => a.slug === slug) || null
}
