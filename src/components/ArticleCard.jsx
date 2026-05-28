import { Link } from 'react-router-dom'
import './ArticleCard.css'

export default function ArticleCard({ article }) {
  return (
    <article className="article-card">
      <time className="article-card__date">{article.date}</time>
      <h3 className="article-card__title">
        <Link to={`/insights/${article.slug}`}>{article.title}</Link>
      </h3>
      <p className="article-card__desc">{article.description}</p>
      <Link to={`/insights/${article.slug}`} className="article-card__link">
        {article.readTime} · Read Memo →
      </Link>
    </article>
  )
}
