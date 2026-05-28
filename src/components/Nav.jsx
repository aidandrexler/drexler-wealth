import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Nav.css'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const observerRef = useRef(null)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel')
    if (!sentinel) {
      setScrolled(window.scrollY > 80)
      const onScroll = () => setScrolled(window.scrollY > 80)
      window.addEventListener('scroll', onScroll)
      return () => window.removeEventListener('scroll', onScroll)
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    )
    observerRef.current.observe(sentinel)
    return () => observerRef.current?.disconnect()
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const contactHref =
    location.pathname === '/' ? '#contact' : '/#contact'

  return (
    <>
      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="nav__inner container">
          <Link to="/" className="nav__logo">
            DWS
          </Link>

          <nav className="nav__links" aria-label="Main">
            <Link to="/strategy-lab">Strategy Lab</Link>
            <Link to="/insights">Insights</Link>
            <a href={contactHref}>Contact</a>
          </nav>

          <button
            type="button"
            className="nav__toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        className={`nav__overlay ${menuOpen ? 'nav__overlay--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav className="nav__overlay-links" aria-label="Mobile">
          <Link to="/strategy-lab" onClick={() => setMenuOpen(false)}>
            Strategy Lab
          </Link>
          <Link to="/insights" onClick={() => setMenuOpen(false)}>
            Insights
          </Link>
          <a href={contactHref} onClick={() => setMenuOpen(false)}>
            Contact
          </a>
        </nav>
      </div>
    </>
  )
}
