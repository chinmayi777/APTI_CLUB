import React, { useCallback, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowLeft, CalendarCheck, UserPlus, Users } from 'lucide-react'
import { useApp } from '../context'
import { apiRequest } from '../api'

const initialForm = {
  full_name: '',
  usn: '',
  email: '',
  password: ''
}

export default function CoordinatorManagement() {
  const { user, token } = useApp()
  const [form, setForm] = useState(initialForm)
  const [coordinators, setCoordinators] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadCoordinators = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await apiRequest('/admin/coordinators', { token })
      setCoordinators(data.coordinators || [])
    } catch (loadError) {
      setError(loadError.message || 'Could not load coordinators.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadCoordinators()
  }, [loadCoordinators])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/events" replace />
  }

  const change = event => {
    setForm(current => ({
      ...current,
      [event.target.name]: event.target.value
    }))
  }

  const createCoordinator = async event => {
    event.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)

    try {
      const result = await apiRequest('/admin/coordinators', {
        method: 'POST',
        body: {
          ...form,
          full_name: form.full_name.trim(),
          usn: form.usn.trim().toUpperCase(),
          email: form.email.trim().toLowerCase()
        },
        token
      })

      setForm({ ...initialForm })
      setMessage(result.message || 'Coordinator account created.')
      await loadCoordinators()
    } catch (createError) {
      setError(createError.message || 'Could not create coordinator account.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-shell coordinator-management">
      <div className="page-hero compact">
        <span className="eyebrow">ADMIN / TEAM MANAGEMENT</span>
        <h1>Create and <em>track coordinators.</em></h1>
        <p>Create coordinator accounts and track their event activity.</p>
        <Link to="/admin" className="text-link">
          <ArrowLeft size={15} /> Back to event management
        </Link>
      </div>

      <div className="coordinator-management-grid">
        <section className="admin-form-card">
          <span className="eyebrow">NEW COORDINATOR / +</span>
          <h2>Create a coordinator account</h2>
          <form onSubmit={createCoordinator} className="admin-form">
            <label>
              Full name
              <input
                name="full_name"
                required
                autoComplete="name"
                value={form.full_name}
                onChange={change}
                placeholder="Coordinator name"
              />
            </label>

            <label>
              USN <small>Optional</small>
              <input
                name="usn"
                autoComplete="off"
                value={form.usn}
                onChange={change}
                placeholder="e.g. 4XX23CS001"
              />
            </label>

            <label>
              Email address
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={change}
                placeholder="name@example.com"
              />
            </label>

            <label>
              Initial password
              <input
                type="password"
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={form.password}
                onChange={change}
                placeholder="At least 8 characters"
              />
            </label>

            {error && <div className="form-error" role="alert">{error}</div>}
            {message && <div className="form-success" role="status">{message}</div>}

            <button className="btn btn-acid" type="submit" disabled={saving}>
              <UserPlus size={16} />
              {saving ? 'Creating account...' : 'Create coordinator'}
            </button>
          </form>
        </section>

        <section className="coordinator-list">
          <div className="coordinator-list-heading">
            <div>
              <span className="eyebrow">COORDINATOR DIRECTORY</span>
              <h2><Users size={19} /> {coordinators.length} accounts</h2>
            </div>
            <button className="text-link" type="button" onClick={loadCoordinators}>
              Refresh
            </button>
          </div>

          {loading && <div className="empty-state">Loading coordinators...</div>}

          {!loading && error && coordinators.length === 0 && (
            <div className="empty-state">
              {error}
              <button className="text-link" type="button" onClick={loadCoordinators}>Retry</button>
            </div>
          )}

          {!loading && !error && coordinators.length === 0 && (
            <div className="empty-state">No coordinator accounts yet.</div>
          )}

          {coordinators.map(coordinator => (
            <article className="coordinator-row" key={coordinator.id}>
              <div className="coordinator-identity">
                <strong>{coordinator.full_name}</strong>
                <span>{coordinator.email}</span>
                {coordinator.usn && <span>{coordinator.usn}</span>}
              </div>
              <span className={`coordinator-status ${coordinator.is_active ? 'active' : ''}`}>
                {coordinator.is_active ? 'Active' : 'Inactive'}
              </span>
              <div className="coordinator-activity">
                <span><CalendarCheck size={14} /> {coordinator.events_created} created</span>
                <span>{coordinator.events_published} published</span>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
