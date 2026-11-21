import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  LockKeyhole
} from 'lucide-react'
import { useApp } from '../context'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [usn, setUsn] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, signup } = useApp()
  const nav = useNavigate()

  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const err = mode === 'signup'
      ? await signup(name, usn, email, password)
      : await login(email, password)

    setLoading(false)

    if (err) {
      setError(err)
      return
    }

    nav('/')
  }

  return (
    <div className="auth-page">
      <div className="auth-art">
        <Link to="/" className="brand">
          <span className="brand-mark">✳</span> APTI<span>CLUB</span>
          <i>.</i>
        </Link>

        <div>
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <h2>
            Make your
            <br />
            potential <em>impossible</em>
            <br />
            to ignore.
          </h2>
          <p>One login closer to your next big thing.</p>
        </div>

        <span className="auth-art-foot">
          LEARN LOUD. SHOW UP READY.
        </span>
      </div>

      <div className="auth-form-wrap">
        <Link to="/" className="back-link">
          <ArrowLeft size={15} /> Back to home
        </Link>

        <div className="auth-form">
          <span className="eyebrow">
            {mode === 'login' ? 'WELCOME BACK' : 'GET STARTED'}
          </span>

          <h1>
            {mode === 'login'
              ? 'Good to see you.'
              : 'Your story starts here.'}
          </h1>

          <p>
            {mode === 'login'
              ? 'Sign in with your email to continue.'
              : 'Create your student account.'}
          </p>

          <form onSubmit={submit}>
            {mode === 'signup' && (
              <>
                <label>
                  Full name
                  <input
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </label>

                <label>
                  University Seat Number (USN)
                  <input
                    required
                    value={usn}
                    onChange={e => setUsn(e.target.value)}
                    placeholder="e.g. 4XX23CS001"
                    autoCapitalize="characters"
                  />
                </label>
              </>
            )}

            <label>
              Email address
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label>
              Password
              <div className="password-field">
                <input
                  required
                  minLength={8}
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={
                    mode === 'signup'
                      ? 'At least 8 characters'
                      : 'Your password'
                  }
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                >
                  {show
                    ? <EyeOff size={17} />
                    : <Eye size={17} />}
                </button>
              </div>
            </label>

            {error && (
              <div className="form-error">{error}</div>
            )}

            <button
              className="btn btn-acid auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Please wait...'
                : mode === 'login'
                ? 'Sign in'
                : 'Create account'}

              {!loading && <ArrowUpRight size={17} />}
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'login'
              ? 'New to Apti Club?'
              : 'Already have an account?'}{' '}

            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login')
                setError('')
              }}
            >
              {mode === 'login'
                ? 'Create account'
                : 'Sign in'}
            </button>
          </div>

          <div className="auth-note">
            <LockKeyhole size={14} />
            Your account is securely authenticated by Apti Club.
          </div>
        </div>
      </div>
    </div>
  )
}
