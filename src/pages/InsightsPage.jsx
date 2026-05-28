import { Helmet } from 'react-helmet-async'
import { getAllArticles } from '../utils/blog'
import ArticleCard from '../components/ArticleCard'
import './InsightsPage.css'

export default function InsightsPage() {
  const articles = getAllArticles()

  return (
    <>
      <Helmet>
        <title>Insights & Memos | Drexler Wealth Strategy</title>
        <meta
          name="description"
          content="Analyses at the intersection of Florida law and wealth strategy."
        />
      </Helmet>

      <main className="insights-page section-pad">
        <div className="container">
          <p className="eyebrow">Insights & Memos</p>
          <h1 className="insights-page__headline section-heading">
            Short, precise analyses at the intersection of law and wealth.
          </h1>
          <div className="insights-page__grid">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
