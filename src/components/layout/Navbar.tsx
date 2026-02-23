import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const navLinks = [
  { label: 'Home', href: '/', isRoute: true },
  { label: 'Tracks', href: '/#tracks' },
  { label: 'Timeline', href: '/#timeline' },
  { label: 'Team', href: '/teams', isRoute: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-text glitch-text" data-text="ALGOSTORM 2.0">
            ALGO<span className="navbar__logo-accent">STORM</span>
            <span className="navbar__logo-version">2.0</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="navbar__links">
          {navLinks.map((link) => (
            link.isRoute ? (
              <Link key={link.label} to={link.href} className="nav-btn">
                <span className="nav-btn__inner">{link.label}</span>
              </Link>
            ) : (
              <a key={link.label} href={link.href} className="nav-btn">
                <span className="nav-btn__inner">{link.label}</span>
              </a>
            )
          ))}
        </div>

        {/* CTA */}
        <a href="#register" className="nav-btn nav-btn--cta">
          <span className="nav-btn__inner nav-btn__inner--cta">Join the Heist</span>
        </a>

        {/* Mobile Toggle */}
        <button
          className="navbar__toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="nav-btn nav-btn--mobile"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="nav-btn__inner">{link.label}</span>
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="nav-btn nav-btn--mobile"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="nav-btn__inner">{link.label}</span>
                </a>
              )
            ))}
            <a href="#register" className="nav-btn nav-btn--cta nav-btn--mobile-cta" onClick={() => setMobileOpen(false)}>
              <span className="nav-btn__inner nav-btn__inner--cta">Join the Heist</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

