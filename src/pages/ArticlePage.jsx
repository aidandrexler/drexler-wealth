import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { marked } from 'marked'
import { getArticleBySlug } from '../utils/blog'
import './ArticlePage.css'

export default function ArticlePage() {
  const { slug } = useParams()
  const article = getArticleBySlug(slug)

  if (!article) {
    return (
      <main className="article-page section-pad">
        <div className="container article-page__inner">
          <p className="eyebrow">Not Found</p>
          <h1 className="article-page__title">Memo not found</h1>
          <Link to="/insights" className="article-page__back">
            ← All Memos
          </Link>
        </div>
      </main>
    )
  }

  const html = marked.parse(article.content)

  return (
    <>
      <Helmet>
        <title>{article.title} | Drexler Wealth Strategy</title>
        <meta name="description" content={article.description} />
      </Helmet>

      <main className="article-page section-pad">
        <div className="container article-page__inner">
          <Link to="/insights" className="article-page__back">
            ← All Memos
          </Link>
          <h1 className="article-page__title">{article.title}</h1>
          <p className="article-page__meta">
            {article.date} · {article.readTime}
          </p>
          <div
            className="article-page__body"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <p className="article-page__disclaimer">
            The content on this site is for educational purposes only. Nothing
            presented here constitutes legal, tax, investment, or financial
            planning advice. Consult licensed counsel before acting on any
            information presented.
          </p>
        </div>
      </main>
    </>
  )
}
