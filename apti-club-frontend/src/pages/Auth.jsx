import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { useApp } from '../context'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [usn, setUsn] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Student')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  const { login, signup, users } = useApp()
  const nav = useNavigate()

 const submit=e=>{
  e.preventDefault()

  const err = mode==='signup'
    ? signup(name,usn,password,role)
    : login(usn,password)

  if(err){
    setError(err)
    return
  }

  const account = mode==='signup'
    ? {role}
    : users.find(
        x=>x.usn.toLowerCase()===usn.toLowerCase()
      )

  const userRole=account?.role||'Student'

  nav(
    userRole==='Admin'
      ? '/admin'
      : userRole==='Event Coordinator'
      ? '/coordinator'
      : '/dashboard'
  )
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
        <span className="auth-art-foot">LEARN LOUD. SHOW UP READY.</span>
      </div>

      <div className="auth-form-wrap">
        <Link to="/" className="back-link">
          <ArrowLeft size={15} /> Back to home
        </Link>

        <div className="auth-form">
          <span className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'GET STARTED'}</span>
          <h1>{mode === 'login' ? 'Good to see you.' : 'Your story starts here.'}</h1>
          <p>
            {mode === 'login'
              ? 'Sign in with your USN to continue.'
              : 'Create your student account with your USN.'}
          </p>

          <form onSubmit={submit}>
            {mode === 'signup' && (
              <label>
                Full name
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </label>
            )}

            <label>
              University Seat Number (USN)
              <input
                required
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                placeholder="e.g. 4XX23CS001"
                autoCapitalize="characters"
              />
            </label>

            <label>
              Password
              <div className="password-field">
                <input
                  required
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                />
                <button type="button" onClick={() => setShow(!show)}>
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>

            {mode === 'login' && (
              <label>
                Demo role{' '}
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option>Student</option>
                  <option>Event Coordinator</option>
                  <option>Admin</option>
                </select>
                <small>
                  For frontend preview only. Role access will be securely assigned by the backend.
                </small>
              </label>
            )}

            {error && <div className="form-error">{error}</div>}

            <button className="btn btn-acid auth-submit" type="submit">
              {mode === 'login' ? 'Sign in' : 'Create account'} <ArrowUpRight size={17} />
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'login' ? 'New to Apti Club?' : 'Already have an account?'}{' '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login')
                setError('')
              }}
            >
              {mode === 'login' ? 'Create account' : 'Sign in'}
            </button>
          </div>

          <div className="auth-note">
            <LockKeyhole size={14} /> Demo frontend stores account data only in this browser.
          </div>
        </div>
      </div>
    </div>
  )
}