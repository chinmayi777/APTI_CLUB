import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Sun, Moon, ArrowUpRight, UserRound, LogOut } from 'lucide-react'
import { useApp } from '../context'
import Chatbot from './Chatbot'
import logo from '../image.png'

export function Header() {
  const [open, setOpen] = useState(false)
  const { user, logout, theme, setTheme } = useApp()
  const nav = [
    ['Home', '/'],
    ['Resources', '/resources'],
    ['Events', '/events'],
    ['Event Archive', '/archive'],
    ['About', '/about'],
  ]

  return (
    <header className="site-header">
      <div className="nav-inner">
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
              <Link className="profile-link" to="/dashboard">
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
        <p>© {new Date().getFullYear()} Apti Club  Built for the next generation.</p>
        <span>DREAM·DISCOVER·DEFINE</span>
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