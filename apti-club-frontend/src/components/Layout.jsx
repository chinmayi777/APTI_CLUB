import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Sun, Moon, ArrowUpRight, UserRound, LogOut } from 'lucide-react'
import { useApp } from '../context'
import Chatbot from './Chatbot'
import logo from '../image.png'
import logoLeft from '../assets/logo-gsss-left.png'
import logoRight from '../assets/logo-gsss-right.png'

export function Header() {
  const [open, setOpen] = useState(false)
  const { user, logout, theme, setTheme } = useApp()
  const nav = [
    ['Home', '/'],
    ['Resources', '/resources'],
    ['Events', '/events'],
    ['Archive', '/archive'],
    ['About', '/about'],
  ]

  return (
    <header className="site-header">
      <div className="nav-inner">
        <div className="inst-brand" aria-label="GSSSIETW">
          <img src={logoLeft} alt="GSSS emblem" />
          <span>GSSSIETW</span>
          <img src={logoRight} alt="GSSSIETW logo" />
        </div>
        <span className="inst-divider" aria-hidden="true" />
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark"><img src={logo} alt="image" /></span> APTI CLUB
        </Link>

        <nav className={open ? 'nav-links open' : 'nav-links'}>
          {nav.map(([n, p]) => (
            <NavLink
              key={p}
              to={p}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {n}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            className="icon-btn theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {user ? (
            <div className="profile-wrap">
              <Link className="profile-link" to="/">
                <UserRound size={16} />
                <span>{user.name.split(' ')[0]}</span>
              </Link>
              <button
                className="icon-btn logout-btn"
                title="Log out"
                onClick={() => {
                  logout()
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link className="login-link" to="/login">
              Login <ArrowUpRight size={15} />
            </Link>
          )}

          <button className="icon-btn mobile-menu" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} APTI Club</p>
        <span>DREAM·DISCOVER·DEFINE</span>
        <p className="footer-social">
          Follow us on{' '}
          <a
            href="https://www.instagram.com/apticlub_gsss/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-insta-link"
          >
            <img
              width="16"
              height="16"
              src="https://img.icons8.com/fluency/48/instagram-new.png"
              alt="Instagram"
            />
            @apticlub_gsss
          </a>
        </p>
      </div>
    </footer>
  )
}

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <Chatbot />
    </>
  )
}