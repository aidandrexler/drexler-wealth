import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__col">
          <p className="footer__name">Aidan M. Drexler</p>
          <p>Drexler Wealth Strategy</p>
          <p className="footer__title">Private Wealth Strategist</p>
        </div>

        <nav className="footer__col footer__nav" aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/strategy-lab">Strategy Lab</Link>
          <Link to="/insights">Insights</Link>
          <a href="/#contact">Contact</a>
        </nav>

        <div className="footer__col">
          <p>Palm Beach County, Florida</p>
          <p>
            <a href="mailto:drexlerwealth@gmail.com">drexlerwealth@gmail.com</a>
          </p>
          <p>
            <a href="tel:5613104025">561-310-4025</a>
          </p>
        </div>
      </div>

      <div className="container footer__disclaimer">
        <p>
          The content on this site is for educational purposes only. Nothing
          presented here constitutes legal, tax, investment, or financial planning
          advice, and nothing creates a professional relationship of any kind.
          These tools identify questions to explore with licensed counsel.
          Aidan M. Drexler is not currently providing investment advisory services.
          This site does not constitute a solicitation or offer of securities or
          investment advisory services in any jurisdiction.
        </p>
      </div>
    </footer>
  )
}
