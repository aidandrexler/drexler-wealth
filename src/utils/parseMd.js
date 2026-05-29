export function isPublishedDate(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const articleDate = new Date(dateStr || '1970-01-01')
  articleDate.setHours(0, 0, 0, 0)
  return articleDate <= today
}

export function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }
  const data = {}
  match[1].split('\n').forEach((line) => {
    const colon = line.indexOf(':')
    if (colon === -1) return
    const key = line.slice(0, colon).trim()
    const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '')
    data[key] = val
  })
  return { data, content: match[2].trim() }
}
