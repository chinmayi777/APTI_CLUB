
import React, { useEffect, useState } from 'react'
import {
  CalendarDays,
  MapPin,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Plus,
  Trash2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context'
import { formatDate } from '../utils'
import { apiRequest } from '../api'
import '../events.css'

const getEventDate = date => (
  date instanceof Date ? date.toISOString().slice(0, 10) : String(date).slice(0, 10)
)

const getEventEndDateTime = event => new Date(
  `${getEventDate(event.event_date)}T${String(event.end_time || '23:59').slice(0, 5)}`
)

function PastEventAttendance({ event, token }) {
  const [open, setOpen] = useState(false)
  const [attendees, setAttendees] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggle = async () => {
    if (open) {
      setOpen(false)
      return
    }

    setOpen(true)
    if (loaded) return

    setLoading(true)
    setError('')
    try {
      const data = await apiRequest(`/attendance/${event.id}`, { token })
      setAttendees(data.attendees || [])
      setLoaded(true)
    } catch (loadError) {
      setError(loadError.message || 'Could not load event attendance.')
    } finally {
      setLoading(false)
    }
  }

  const present = attendees.filter(attendee => attendee.attendance_status === 'present')
  const absent = attendees.filter(attendee => attendee.attendance_status === 'absent')
  const unmarked = attendees.length - present.length - absent.length
  const presentEnd = attendees.length ? present.length / attendees.length * 100 : 0
  const absentEnd = attendees.length ? (present.length + absent.length) / attendees.length * 100 : 0
  const chartBackground = attendees.length
    ? `conic-gradient(var(--acid) 0 ${presentEnd}%, var(--coral) ${presentEnd}% ${absentEnd}%, var(--lilac) ${absentEnd}% 100%)`
    : 'var(--panel2)'

  return (
    <article className={`past-event-card ${open ? 'past-event-card--open' : ''}`}>
      <button
        type="button"
        className="past-event-trigger"
        aria-expanded={open}
        onClick={toggle}
      >
        <span className="past-event-trigger-main">
          <strong>{event.title}</strong>
          <span>{formatDate(getEventDate(event.event_date))} · {event.venue}</span>
        </span>
        <span className="past-event-trigger-action">
          {open ? 'Hide attendance' : 'View attendance'} <ArrowUpRight size={15} />
        </span>
      </button>

      {open && (
        <div className="past-event-details">
          {loading && <p className="muted">Loading attendance...</p>}
          {error && <div className="form-error" role="alert">{error}</div>}

          {!loading && !error && (
            <>
              <div className="past-event-summary">
                <div
                  className="attendance-pie"
                  role="img"
                  aria-label={`Attendance: ${present.length} present, ${absent.length} absent, ${unmarked} unmarked`}
                  style={{ background: chartBackground }}
                >
                  <span><strong>{attendees.length}</strong><small>REGISTERED</small></span>
                </div>

                <div className="attendance-stats">
                  <div><span className="attendance-legend attendance-legend--present" />Present<strong>{present.length}</strong></div>
                  <div><span className="attendance-legend attendance-legend--absent" />Absent<strong>{absent.length}</strong></div>
                  <div><span className="attendance-legend attendance-legend--unmarked" />Unmarked<strong>{unmarked}</strong></div>
                </div>
              </div>

              <div className="attended-students">
                <h3>Students attended <span>{present.length}</span></h3>
                {present.length === 0 ? (
                  <p className="muted">No students are marked as present yet.</p>
                ) : (
                  <ul>
                    {present.map(attendee => (
                      <li key={attendee.registration_id}>
                        <CheckCircle2 size={15} />
                        <span>{attendee.full_name}</span>
                        <small>{attendee.usn}</small>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </article>
  )
}

export default function Events() {
  const { user, token, register, registrations } = useApp()
  const isStaff = user?.role === 'admin' || user?.role === 'coordinator'

  const [events, setEvents] = useState([])
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [registeringId, setRegisteringId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await apiRequest(isStaff ? '/events/manage' : '/events', { token })

        setEvents(data.events || [])
      } catch (err) {
        setError(err.message || 'Could not load events.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [isStaff, token])

  const now = new Date()
  const upcoming = events
    .filter(event => event.status === 'published' && getEventEndDateTime(event) >= now)
    .sort((a, b) => getEventDate(a.event_date).localeCompare(getEventDate(b.event_date)))
  const pastEvents = isStaff
    ? events
      .filter(event => (
        ['published', 'completed'].includes(event.status) &&
        (event.status === 'completed' || getEventEndDateTime(event) < now)
      ))
      .sort((a, b) => getEventDate(b.event_date).localeCompare(getEventDate(a.event_date)))
    : []

  const join = async id => {
  setRegisteringId(id)
  setNotice('')

  const result = await register(id)

  setNotice(
    result || 'You’re in! Your registration has been saved.'
  )

  setRegisteringId(null)
}

  const deleteEvent = async event => {
    const confirmed = window.confirm(
      `Delete "${event.title}"? Its registrations and attendance records will also be deleted.`
    )
    if (!confirmed) return

    setActionError('')
    setDeletingId(event.id)
    try {
      const result = await apiRequest(`/events/${event.id}`, {
        method: 'DELETE',
        token
      })
      setEvents(current => current.filter(item => Number(item.id) !== Number(event.id)))
      setNotice(result.message || 'Event deleted successfully.')
    } catch (deleteError) {
      setActionError(deleteError.message || 'Could not delete the event.')
    } finally {
      setDeletingId(null)
    }
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

      {actionError && <div className="form-error" role="alert">{actionError}</div>}

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
        <>
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

                    {isStaff ? (
                      <button
                        className="btn btn-event-delete"
                        type="button"
                        onClick={() => deleteEvent(e)}
                        disabled={deletingId === eventId}
                      >
                        <Trash2 size={15} />
                        {deletingId === eventId ? 'Deleting event...' : 'Delete event'}
                      </button>
                    ) : (
                      <button
                        className={registered ? 'btn btn-registered' : 'btn btn-dark'}
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
                        ) : count >= e.capacity ? (
                          'Event full'
                        ) : (
                          <>
                            Register now
                            <ArrowUpRight size={16} />
                          </>
                        )}
                      </button>
                    )}
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

          {isStaff && (
            <section className="past-events-section">
              <div className="past-events-heading">
                <span className="eyebrow">EVENT HISTORY / ATTENDANCE</span>
                <h2>Conducted events</h2>
                <p>Select an event to review its attendance summary.</p>
              </div>

              {pastEvents.length > 0 ? (
                <div className="past-events-list">
                  {pastEvents.map(event => (
                    <PastEventAttendance key={event.id} event={event} token={token} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">No conducted events yet.</div>
              )}
            </section>
          )}
        </>
      )}

      <div className="event-bottom-note">
        YOUR PEOPLE ARE HERE. <span>✳</span> YOUR NEXT STEP IS TOO.
      </div>
    </div>
  )
}
