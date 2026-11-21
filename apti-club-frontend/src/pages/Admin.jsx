import React, { useCallback, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowUpRight, CalendarDays, Plus, Trash2, Users } from 'lucide-react'
import { useApp } from '../context'
import { apiRequest } from '../api'

const initialForm = {
  title: '',
  wing: '',
  description: '',
  venue: '',
  event_date: '',
  start_time: '',
  end_time: '',
  registration_deadline: '',
  capacity: '50'
}

const wings = [
  ['aptitude', 'Aptitude'],
  ['personality', 'Personality'],
  ['technical', 'Technical'],
  ['interview', 'Interview']
]

export default function Admin() {
  const { user, token } = useApp()
  const [form, setForm] = useState(initialForm)
  const [events, setEvents] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishingId, setPublishingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const loadEvents = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await apiRequest('/events/manage', { token })
      setEvents(data.events || [])
    } catch (loadError) {
      setError(loadError.message || 'Could not load managed events.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!['admin', 'coordinator'].includes(user.role)) {
    return <Navigate to="/events" replace />
  }

  const change = event => {
    setForm(current => ({
      ...current,
      [event.target.name]: event.target.value
    }))
  }

  const createEvent = async event => {
    event.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)

    try {
      const payload = {
        ...form,
        registration_deadline: `${form.registration_deadline.replace('T', ' ')}:00`,
        capacity: Number(form.capacity)
      }
      const result = await apiRequest('/events', {
        method: 'POST',
        body: payload,
        token
      })

      setForm(initialForm)
      setMessage(result.message || 'Event created as a draft.')
      await loadEvents()
    } catch (saveError) {
      setError(saveError.message || 'Could not create the event.')
    } finally {
      setSaving(false)
    }
  }

  const publishEvent = async event => {
    setError('')
    setMessage('')
    setPublishingId(event.id)

    try {
      const result = await apiRequest(`/events/${event.id}/status`, {
        method: 'PATCH',
        body: { status: 'published' },
        token
      })

      setMessage(result.message || `${event.title} is now open for registration.`)
      await loadEvents()
    } catch (publishError) {
      setError(publishError.message || 'Could not publish the event.')
    } finally {
      setPublishingId(null)
    }
  }

  const deleteEvent = async event => {
    const confirmed = window.confirm(
      `Delete "${event.title}"? Its registrations and attendance records will also be deleted.`
    )
    if (!confirmed) return

    setError('')
    setMessage('')
    setDeletingId(event.id)

    try {
      const result = await apiRequest(`/events/${event.id}`, {
        method: 'DELETE',
        token
      })
      setMessage(result.message || 'Event deleted successfully.')
      await loadEvents()
    } catch (deleteError) {
      setError(deleteError.message || 'Could not delete the event.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="page-shell">
      <div className="page-hero compact">
        <span className="eyebrow">EVENT CONTROL / STAFF</span>
        <h1>Create and <em>manage events.</em></h1>
        <p>Create an event draft, then publish it to make it available for student registration.</p>
        <div className="admin-page-actions">
          <Link to="/events" className="text-link">
            View event registration page <ArrowUpRight size={15} />
          </Link>
          {user.role === 'admin' && (
            <Link to="/admin/coordinators" className="btn btn-ghost coordinator-management-link">
              <Users size={16} />
              Create / track coordinators
            </Link>
          )}
        </div>
      </div>

      <div className="admin-layout">
        <section className="admin-form-card">
          <span className="eyebrow">NEW EVENT / +</span>
          <h2>Create an event</h2>
          <form onSubmit={createEvent} className="admin-form">
            <label>
              Event title
              <input
                name="title"
                required
                value={form.title}
                onChange={change}
                placeholder="e.g. DSA Sprint"
              />
            </label>

            <label>
              Event wing
              <select name="wing" required value={form.wing} onChange={change}>
                <option value="">Select a wing</option>
                {wings.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={change}
                placeholder="What will students take away?"
              />
            </label>

            <label>
              Venue
              <input
                name="venue"
                required
                value={form.venue}
                onChange={change}
                placeholder="Seminar Hall"
              />
            </label>

            <div className="form-two">
              <label>
                Date
                <input
                  type="date"
                  name="event_date"
                  required
                  value={form.event_date}
                  onChange={change}
                />
              </label>
              <label>
                Registration deadline
                <input
                  type="datetime-local"
                  name="registration_deadline"
                  required
                  value={form.registration_deadline}
                  onChange={change}
                />
              </label>
            </div>

            <div className="form-two">
              <label>
                Start time
                <input
                  type="time"
                  name="start_time"
                  required
                  value={form.start_time}
                  onChange={change}
                />
              </label>
              <label>
                End time
                <input
                  type="time"
                  name="end_time"
                  required
                  value={form.end_time}
                  onChange={change}
                />
              </label>
            </div>

            <label>
              Capacity
              <input
                type="number"
                min="1"
                step="1"
                name="capacity"
                required
                value={form.capacity}
                onChange={change}
              />
            </label>

            {error && <div className="form-error" role="alert">{error}</div>}
            {message && <div className="form-success" role="status">{message}</div>}

            <button className="btn btn-acid" type="submit" disabled={saving}>
              <Plus size={17} />
              {saving ? 'Saving event...' : 'Create draft'}
            </button>
          </form>
        </section>

        <section className="admin-events">
          <div className="admin-list-head">
            <span className="eyebrow">EVENT MANAGER</span>
            <span>{events.length} TOTAL</span>
          </div>

          {loading && <div className="empty-state">Loading events...</div>}

          {!loading && error && events.length === 0 && (
            <div className="empty-state">
              {error}
              <button className="text-link" type="button" onClick={loadEvents}>Retry</button>
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="empty-state">No events have been created yet.</div>
          )}

          {events.map(event => (
            <div className="admin-event-row" key={event.id}>
              <div>
                <b>{event.title}</b>
                <span>
                  <CalendarDays size={13} />
                  {String(event.event_date).slice(0, 10)} · {event.start_time?.slice(0, 5) || 'Time TBD'}
                </span>
                <span>
                  {Number(event.registered_count || 0)} / {event.capacity} registered · {event.status}
                </span>
              </div>

              <div className="admin-event-actions">
                {event.status === 'draft' && (
                  <button
                    className="btn btn-acid"
                    type="button"
                    disabled={publishingId === event.id}
                    onClick={() => publishEvent(event)}
                  >
                    {publishingId === event.id ? 'Publishing...' : 'Publish'}
                  </button>
                )}

                <button
                  className="btn btn-ghost admin-delete-event"
                  type="button"
                  disabled={deletingId === event.id}
                  onClick={() => deleteEvent(event)}
                >
                  <Trash2 size={14} />
                  {deletingId === event.id ? 'Deleting...' : 'Delete event'}
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}