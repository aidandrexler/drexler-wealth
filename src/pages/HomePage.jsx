import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useForm, ValidationError } from '@formspree/react'
import { getAllArticles } from '../utils/blog'
import ArticleCard from '../components/ArticleCard'
import './HomePage.css'

const BIO =
  'Aidan M. Drexler is a private wealth strategist and J.D. candidate based in Palm Beach County, Florida. A Wellington native with a corporate finance background, Aidan is completing his law degree while building a practice focused on estate planning coordination, asset protection strategy, and integrated wealth management for Florida business owners, professionals, and families. The Strategy Lab was built on the premise that the most valuable thing a wealth strategist can do is ask better questions — not give faster answers.'

const LAB_CARDS = [
  {
    num: '01',
    title: 'Coordination Gap Visualizer',
    desc: 'See what falls between your advisors.',
    href: '/strategy-lab?tool=0',
  },
  {
    num: '02',
    title: 'Wealth Architecture Visualizer',
    desc: "Understand Florida's protection layers.",
    href: '/strategy-lab?tool=1',
  },
  {
    num: '03',
    title: 'Asset Exposure Profile',
    desc: 'An 8-question calibrated diagnostic.',
    href: '/strategy-lab?tool=2',
  },
]

const STATS = [
  {
    label: 'MARKET CONTEXT',
    text: 'Palm Beach County is the #1 county in the U.S. for net income inflow from domestic migration, 2019–2023.',
  },
  {
    label: 'THE MOST COMMON GAP',
    text: 'Four advisors. Zero conversations. The most common planning configuration in South Florida.',
  },
  {
    label: 'FLORIDA IS DIFFERENT',
    text: "Out-of-state estate documents require Florida review. Most relocated families haven't done it.",
  },
]

const PLACEHOLDER_ARTICLES = [
  {
    slug: 'coming-soon',
    date: 'Coming Soon',
    title: 'Insights in preparation',
    description: 'New memos on Florida wealth strategy will appear here.',
    readTime: '—',
  },
]

export default function HomePage() {
  const [state, handleSubmit] = useForm('xredrrlb')
  const articles = getAllArticles()
  const previewArticles =
    articles.length >= 3
      ? articles.slice(0, 3)
      : [
          ...articles,
          ...PLACEHOLDER_ARTICLES.slice(0, 3 - articles.length),
        ]

  return (
    <>
      <Helmet>
        <title>
          Drexler Wealth Strategy | Private Wealth Strategist | Palm Beach County
        </title>
        <meta
          name="description"
          content="Bridging legal architecture, tax strategy, and asset protection for Florida business owners, professionals, and families. Palm Beach County."
        />
      </Helmet>

      <section className="hero">
        <div className="hero__content">
          <div className="hero__rule" aria-hidden="true" />
          <h1 className="hero__name">Aidan M. Drexler</h1>
          <p className="hero__title">Private Wealth Strategist</p>
          <p className="hero__hook">
            Bridging legal architecture, tax strategy, and asset protection for
            the modern business owner.
          </p>
          <p className="hero__credentials">
            J.D. Candidate · Series 65 Candidate · B.B.A. Finance
          </p>
          <div className="hero__cta">
            <Link to="/strategy-lab" className="hero__btn">
              Explore the Strategy Lab
            </Link>
            <a href="#contact" className="hero__ghost">
              Initiate a Conversation →
            </a>
          </div>
        </div>
        <div className="hero__bottom-rule" aria-hidden="true" />
        <div id="hero-sentinel" className="hero__sentinel" aria-hidden="true" />
      </section>

      <section className="positioning section-pad">
        <div className="container">
          <p className="eyebrow">The Quarterback Model</p>
          <h2 className="positioning__headline section-heading">
            Most affluent families work with three or four advisors.
            <br />
            Most advisory teams have never spoken to each other.
          </h2>
          <p className="positioning__body">
            The estate attorney drafted the trust. The financial adviser moved the
            brokerage account and titled it in your name. The CPA filed the return.
            Nobody told anyone. The trust now controls nothing. Drexler Wealth
            Strategy was built to be the coordinator that most affluent families
            are missing.
          </p>
          <p className="positioning__body">
            The goal of this practice is what Hughes, Massenzio and Whitaker call
            &apos;complete wealth&apos; — the integration of financial capital with
            the human, intellectual, social, and spiritual capitals that determine
            whether a family&apos;s wealth endures or dissipates across generations.
            Financial capital is important. But it is the least durable of the five
            forms of wealth. The families that flourish over generations are those
            who understand this — and who find advisers willing to work on all five
            dimensions simultaneously.
          </p>
          <div className="positioning__stats">
            {STATS.map((stat) => (
              <div key={stat.label} className="positioning__stat">
                <p className="positioning__stat-label">{stat.label}</p>
                <p className="positioning__stat-text">{stat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lab-preview section-pad">
        <div className="container">
          <p className="eyebrow">The Strategy Lab</p>
          <h2 className="lab-preview__headline">
            Three educational diagnostics built on Florida doctrine.
          </h2>
          <p className="lab-preview__sub">
            Interactive, educational, calibrated to direct you toward the simplest
            appropriate next step — not the most complex one.
          </p>
          <div className="lab-preview__grid">
            {LAB_CARDS.map((card) => (
              <div key={card.num} className="lab-card">
                <span className="lab-card__num">{card.num}</span>
                <h3 className="lab-card__title">{card.title}</h3>
                <p className="lab-card__desc">{card.desc}</p>
                <Link to={card.href} className="lab-card__link">
                  Open Tool →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="insights-preview section-pad">
        <div className="container">
          <p className="eyebrow">Insights & Memos</p>
          <h2 className="insights-preview__headline section-heading">
            Short, precise analyses at the intersection of law and wealth.
          </h2>
          <div className="insights-preview__grid">
            {previewArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
          <Link to="/insights" className="insights-preview__all">
            View All Memos →
          </Link>
        </div>
      </section>

      <section className="about section-pad">
        <div className="container about__grid">
          <div className="about__letter-col" aria-hidden="true">
            <span className="about__letter">A</span>
          </div>
          <div className="about__content">
            <p className="eyebrow">The Operator</p>
            <h2 className="about__name">Aidan M. Drexler</h2>
            <p className="about__bio">{BIO}</p>
            <p className="about__credentials">
              B.B.A. Finance, Florida Atlantic University · J.D. Candidate ·
              Series 65 Candidate · Palm Beach County, FL
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="contact section-pad">
        <div className="container">
          <p className="eyebrow">Initiate a Conversation</p>
          <h2 className="contact__headline">
            Currently accepting a limited number of conversations with estate
            planning professionals, succession-minded advisors, and business
            owners in the South Florida market.
          </h2>

          {state.succeeded ? (
            <p className="contact__success">
              Your message has been received. I will be in touch shortly.
            </p>
          ) : (
            <form className="contact__form" onSubmit={handleSubmit}>
              <div className="contact__row">
                <div className="contact__field">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    autoComplete="given-name"
                  />
                </div>
                <div className="contact__field">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <div className="contact__field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                />
              </div>
              <ValidationError
                prefix="Email"
                field="email"
                errors={state.errors}
              />
              <div className="contact__field">
                <label htmlFor="linkedin">LinkedIn Profile (optional)</label>
                <input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  autoComplete="url"
                />
              </div>
              <div className="contact__field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="What is the primary wealth or planning challenge you are currently exploring?"
                />
              </div>
              <button
                type="submit"
                className="contact__submit"
                disabled={state.submitting}
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
