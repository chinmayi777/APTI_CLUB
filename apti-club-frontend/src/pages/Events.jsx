
import React, { useEffect, useState } from 'react'
import {
  CalendarDays,
  MapPin,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Plus
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context'
import { formatDate } from '../utils'
import { apiRequest } from '../api'
import '../events.css'

export default function Events() {
  const { user, register, registrations } = useApp()

  const [events, setEvents] = useState([])
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [registeringId, setRegisteringId] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await apiRequest('/events')

        setEvents(data.events || [])
      } catch (err) {
        setError(err.message || 'Could not load events.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const getEventDate = date => {
    if (date instanceof Date) {
      return date.toISOString().slice(0, 10)
    }

    return String(date).slice(0, 10)
  }

  const upcoming = events
    .filter(e => {
      const date = getEventDate(e.event_date)
      return new Date(date + 'T23:59:00') >= new Date()
    })
    .sort((a, b) =>
      getEventDate(a.event_date).localeCompare(
        getEventDate(b.event_date)
      )
    )

  const join = async id => {
  setRegisteringId(id)
  setNotice('')

  const result = await register(id)

  setNotice(
    result || 'You’re in! Your registration has been saved.'
  )

  setRegisteringId(null)
}

  return (
    <div className="page-shell events-page">
      <div className="page-hero events-hero">
        <span className="eyebrow">CAMPUS CALENDAR / 02</span>

        <h1>
          Events
        </h1>

        {(user?.role === 'admin' || user?.role === 'coordinator') && (
          <Link to="/admin" className="btn btn-acid events-create-button">
            <Plus size={16} />
            Create an event
          </Link>
        )}

        <p>
          Good people, practical sessions and experiences
          worth showing up for.
        </p>

        <div className="events-count">
          <b>{upcoming.length.toString().padStart(2, '0')}</b>
          <span>
            UPCOMING
            <br />
            SESSIONS
          </span>
        </div>
      </div>

      {notice && (
        <div className="notice-bar">
          {notice}
          <button onClick={() => setNotice('')}>×</button>
        </div>
      )}

      <div className="events-toolbar">
        <span className="eyebrow">WHAT'S COMING UP</span>
      </div>

      {loading && (
        <div className="empty-state">
          Loading events...
        </div>
      )}

      {error && (
        <div className="form-error">
          {error}
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="event-grid">
          {upcoming.map((e, index) => {
            const eventId = e.id
            const date = getEventDate(e.event_date)
            const time = e.start_time
              ? String(e.start_time).slice(0, 5)
              : 'Time TBD'
            const count = Number(e.registered_count || 0)

            const registered = registrations.some(
  r =>
    Number(r.eventId) === Number(eventId) &&
    r.usn === user?.usn &&
    r.status === 'registered'
)
            const canRegister = user?.role === 'student'

            return (
              <article
                className="event-card"
                key={eventId}
                style={{ '--card-index': index }}
              >
                <div className="event-card-body">
                  <h3>{e.title}</h3>
                  <span className="event-wing">
                    {e.wing || 'Wing not specified'}
                  </span>
                  <p title={e.description || ''}>
                    {e.description || 'Details coming soon.'}
                  </p>

                  <div className="event-meta">
                    <span>
                      <CalendarDays size={14} />
                      {formatDate(date)}
                    </span>

                    <span>
                      <Clock size={14} />
                      {time}
                    </span>

                    <span className="event-venue">
                      <MapPin size={14} />
                      {e.venue}
                    </span>
                  </div>

                  <button
                    className={
                      registered
                        ? 'btn btn-registered'
                        : 'btn btn-dark'
                    }
                    onClick={() => join(eventId)}
                    disabled={
                      !user ||
                      !canRegister ||
                      registered ||
                      count >= e.capacity ||
                      registeringId === eventId
                    }
                  >
                    {registered ? (
                      <>
                        <CheckCircle2 size={16} />
                        Registered
                      </>
                    ) : !user ? (
                      'Login to register'
                    ) : !canRegister ? (
                      'Student registration only'
                    ) : count >= e.capacity ? (
                      'Event full'
                    ) : (
                      <>
                        Register now
                        <ArrowUpRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </article>
            )
          })}

          {upcoming.length === 0 && (
            <div className="empty-state">
              No upcoming events just yet. Check back soon!
            </div>
          )}
        </div>
      )}

      <div className="event-bottom-note">
        YOUR PEOPLE ARE HERE. <span>✳</span> YOUR NEXT STEP IS TOO.
      </div>
    </div>
  )
}
