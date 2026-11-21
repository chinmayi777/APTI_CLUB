import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowUpRight,
  MoveUpRight,
  Sparkles,
  CalendarDays,
  Clock,
  MapPin,
  BookOpen,
  Users,
  UserPlus,
  Check,
  X,
} from 'lucide-react'
import { useApp } from '../context'
import Scene from '../components/Scene'
import ResourceCard from '../components/ResourceCard'
import { apiRequest } from '../api'
import { formatDate } from '../utils'
import '../home.css'

function AdminHomeDashboard({ token }) {
  const [coordinators, setCoordinators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const fetchCoordinators = async () => {
      try {
        const data = await apiRequest('/admin/coordinators', { token })
        if (!cancelled) {
          setCoordinators(data.coordinators || [])
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || 'Could not load coordinators.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchCoordinators()
    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <section className="section-shell admin-home-dashboard" id="admin-dashboard">
      <div className="admin-home-heading">
        <span className="eyebrow">ADMIN CONTROL ROOM / 01</span>
        <h2>Manage campus activity.</h2>
        <p>Create events and manage the coordinator team from one place.</p>
      </div>

      <div className="admin-home-grid">
        <Link to="/admin" className="admin-home-card admin-home-event-card">
          <CalendarDays size={23} />
          <span className="eyebrow">EVENTS / 01</span>
          <h3>Create and manage events</h3>
          <p>Draft events, review registrations and publish upcoming sessions.</p>
          <span className="admin-home-card-link">
            Open event manager <ArrowUpRight size={15} />
          </span>
        </Link>

        <section className="admin-home-card admin-home-coordinators">
          <div className="admin-home-coordinators-heading">
            <div>
              <span className="eyebrow">TEAM / 02</span>
              <h3><Users size={19} /> Coordinators</h3>
            </div>
            <Link to="/admin/coordinators" className="btn btn-acid admin-home-add">
              <UserPlus size={15} />
              Create coordinator
            </Link>
          </div>

          {loading && <p className="admin-home-coordinator-state">Loading coordinators...</p>}
          {error && <p className="admin-home-coordinator-state form-error" role="alert">{error}</p>}
          {!loading && !error && coordinators.length === 0 && (
            <p className="admin-home-coordinator-state">No coordinators yet. Create the first account to get started.</p>
          )}

          {!error && coordinators.length > 0 && (
            <div className="admin-home-coordinator-list">
              {coordinators.map(coordinator => (
                <div className="admin-home-coordinator-row" key={coordinator.id}>
                  <div>
                    <strong>{coordinator.full_name}</strong>
                    <span>{coordinator.email}</span>
                  </div>
                  <span className="admin-home-coordinator-count">
                    {coordinator.events_created} events
                  </span>
                </div>
              ))}
            </div>
          )}

          <Link to="/admin/coordinators" className="text-link admin-home-view-all">
            View coordinator management <ArrowUpRight size={15} />
          </Link>
        </section>
      </div>
    </section>
  )
}

function CoordinatorHomeDashboard({ token }) {
  const [events, setEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [eventsError, setEventsError] = useState('')
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [attendees, setAttendees] = useState([])
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [attendanceError, setAttendanceError] = useState('')
  const [attendanceMessage, setAttendanceMessage] = useState('')
  const [savingRegistrationId, setSavingRegistrationId] = useState(null)

  useEffect(() => {
    let cancelled = false

    const fetchEvents = async () => {
      try {
        const data = await apiRequest('/events/manage', { token })
        if (!cancelled) {
          setEvents(data.events || [])
        }
      } catch (fetchError) {
        if (!cancelled) {
          setEventsError(fetchError.message || 'Could not load events.')
        }
      } finally {
        if (!cancelled) {
          setLoadingEvents(false)
        }
      }
    }

    fetchEvents()
    return () => {
      cancelled = true
    }
  }, [token])

  const publishedEvents = events
    .filter(event => event.status === 'published')
    .map(event => ({
      ...event,
      startsAt: new Date(
        `${String(event.event_date).slice(0, 10)}T${String(event.start_time || '00:00').slice(0, 5)}`
      ),
      endsAt: new Date(
        `${String(event.event_date).slice(0, 10)}T${String(event.end_time || '23:59').slice(0, 5)}`
      )
    }))
    .sort((a, b) => a.startsAt - b.startsAt)
  const now = new Date()
  const happeningEvent = publishedEvents.find(
    event => event.startsAt <= now && event.endsAt >= now
  )
  const currentEvent = happeningEvent || publishedEvents.find(event => event.startsAt > now)

  const toggleAttendance = async event => {
    setAttendanceError('')
    setAttendanceMessage('')

    if (selectedEventId === event.id) {
      setSelectedEventId(null)
      return
    }

    setSelectedEventId(event.id)
    setAttendees([])
    setLoadingAttendance(true)

    try {
      const data = await apiRequest(`/attendance/${event.id}`, { token })
      setAttendees(data.attendees || [])
    } catch (fetchError) {
      setAttendanceError(fetchError.message || 'Could not load event registrations.')
    } finally {
      setLoadingAttendance(false)
    }
  }

  const markAttendance = async (attendee, status) => {
    setAttendanceError('')
    setAttendanceMessage('')
    setSavingRegistrationId(attendee.registration_id)

    try {
      await apiRequest(`/attendance/${currentEvent.id}/mark`, {
        method: 'POST',
        body: {
          registration_id: attendee.registration_id,
          status: status.toLowerCase()
        },
        token
      })

      setAttendees(current => current.map(item => (
        item.registration_id === attendee.registration_id
          ? { ...item, attendance_status: status.toLowerCase() }
          : item
      )))
      setAttendanceMessage(`Marked ${attendee.full_name} ${status.toLowerCase()}.`)
    } catch (markError) {
      setAttendanceError(markError.message || 'Could not update attendance.')
    } finally {
      setSavingRegistrationId(null)
    }
  }

  return (
    <section className="section-shell coordinator-home-dashboard" id="coordinator-dashboard">
      <div className="coordinator-home-heading">
        <div>
          <span className="eyebrow">COORDINATOR CONTROL ROOM / 01</span>
          <h2>Bring people <em>together.</em></h2>
          <p>Create an event, then check in its registered students.</p>
        </div>
        <Link to="/admin" className="btn btn-acid coordinator-create-event">
          <CalendarDays size={16} />
          Create an event
        </Link>
      </div>

      <section className="coordinator-current-event-section">
        <div className="coordinator-current-event-heading">
          <span className="eyebrow">EVENT CHECK-IN / 02</span>
          {happeningEvent && <span className="coordinator-live-status">HAPPENING NOW</span>}
        </div>

        {loadingEvents && <div className="empty-state">Loading events...</div>}
        {eventsError && <div className="form-error" role="alert">{eventsError}</div>}
        {!loadingEvents && !eventsError && !currentEvent && (
          <div className="empty-state">
            No current or upcoming published events. Create a draft event or check back later.
          </div>
        )}

        {currentEvent && (
          <article className="coordinator-event">
            <button
              type="button"
              className="coordinator-event-trigger"
              aria-expanded={selectedEventId === currentEvent.id}
              aria-controls="coordinator-attendance"
              onClick={() => toggleAttendance(currentEvent)}
            >
              <span className="coordinator-event-label">
                {happeningEvent ? 'CURRENT EVENT' : 'UP NEXT'}
              </span>
              <span className="coordinator-event-title">{currentEvent.title}</span>
              <span className="coordinator-event-meta">
                <span><CalendarDays size={14} /> {formatDate(String(currentEvent.event_date).slice(0, 10))}</span>
                <span><Clock size={14} /> {String(currentEvent.start_time || '').slice(0, 5)}</span>
                <span><MapPin size={14} /> {currentEvent.venue}</span>
              </span>
              <span className="coordinator-event-action">
                {selectedEventId === currentEvent.id ? 'Hide attendance' : 'View attendance'}
                <ArrowUpRight size={15} />
              </span>
            </button>

            {selectedEventId === currentEvent.id && (
              <div className="coordinator-attendance" id="coordinator-attendance">
                <div className="coordinator-attendance-heading">
                  <h3>Registered students</h3>
                  <span>{attendees.length} registered</span>
                </div>

                {loadingAttendance && <p className="muted">Loading registered students...</p>}
                {attendanceError && <div className="form-error" role="alert">{attendanceError}</div>}
                {attendanceMessage && <div className="form-success" role="status">{attendanceMessage}</div>}
                {!loadingAttendance && !attendanceError && attendees.length === 0 && (
                  <p className="muted">No students are registered for this event yet.</p>
                )}

                {attendees.map(attendee => {
                  const status = attendee.attendance_status
                  const isSaving = savingRegistrationId === attendee.registration_id

                  return (
                    <div className="coordinator-attendee-row" key={attendee.registration_id}>
                      <div className="coordinator-attendee-identity">
                        <strong>{attendee.full_name}</strong>
                        <span>{attendee.usn}</span>
                      </div>
                      <span className={`attendance-status ${
                        status === 'present' ? 'present' : status === 'absent' ? 'absent' : 'pending'
                      }`}>
                        {status === 'not_marked' ? 'Unmarked' : status}
                      </span>
                      <div className="attendance-actions">
                        <button
                          className="mark-present"
                          type="button"
                          disabled={isSaving}
                          onClick={() => markAttendance(attendee, 'Present')}
                          aria-label={`Mark ${attendee.full_name} present`}
                        >
                          <Check size={16} />
                        </button>
                        <button
                          className="mark-absent"
                          type="button"
                          disabled={isSaving}
                          onClick={() => markAttendance(attendee, 'Absent')}
                          aria-label={`Mark ${attendee.full_name} absent`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </article>
        )}
      </section>
    </section>
  )
}

export default function Home() {
  const { user, token, registrations } = useApp()
  const isAdmin = user?.role === 'admin'
  const isCoordinator = user?.role === 'coordinator'
  const [events, setEvents] = useState([])
  const [eventsError, setEventsError] = useState('')

  useEffect(() => {
    let cancelled = false

    const fetchEvents = async () => {
      if (!user || user.role !== 'student') {
        setEvents([])
        setEventsError('')
        return
      }

      try {
        setEventsError('')
        const data = await apiRequest('/events', { token })
        if (!cancelled) {
          setEvents(data.events || [])
        }
      } catch (error) {
        if (!cancelled) {
          setEventsError(error.message || 'Could not load your registered events.')
        }
      }
    }

    fetchEvents()

    return () => {
      cancelled = true
    }
  }, [token, user])

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const tomorrowStr = tomorrow.toISOString().slice(0, 10)

const upcomingTomorrowEvents = events.filter(event => {
  const eventDate = String(event.event_date).slice(0, 10)
  return eventDate === tomorrowStr && event.status === 'published'
})
  const myRegistrations = registrations.filter(
    registration =>
      user?.role === 'student' &&
      registration.usn === user.usn &&
      registration.status === 'registered'
  )
  const registeredEvents = myRegistrations
    .map(registration =>
      events.find(event => Number(event.id) === Number(registration.eventId))
    )
    .filter(Boolean)
  const firstName =
    user?.name?.trim().split(/\s+/)[0] ||
    user?.full_name?.trim().split(/\s+/)[0] ||
    'there'

  const cats = [
    ['Aptitude', 'Aptitude Arena', 'Train your brain for the moments that count.'],
    ['Interview', 'Interview Prep', 'Walk in with clarity. Walk out with confidence.'],
    ['DSA', 'DSA Zone', 'Build the patterns behind great problem solvers.'],
    ['CS Fundamentals', 'Core Subjects', 'Own the fundamentals. Make every answer count.'],
  ]

  return (
    <>
      <section className="hero section-shell">
        <div className="hero-copy">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="eyebrow-pill"
          >
            <span />
            {isAdmin
              ? 'ADMIN CONTROL ROOM'
              : isCoordinator
                ? 'MISSION: BRING CHANGE'
                : 'MISSION: GET HIRED'}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {user ? (
              <>Hey, {firstName}</>
            ) : (
              <>
                Apti Club
                <span className="hero-star">✳</span>
                <em>Placement,</em>
              </>
            )}
            <br />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {isAdmin
              ? 'Welcome back. Create events and keep your coordinator team moving.'
              : isCoordinator
                ? 'Bring students together, create meaningful events and make every check-in count.'
                : 'Your unfair advantage starts here. Find your resources, build real skills and show up ready for the opportunities ahead.'}
          </motion.p>

          <motion.div
            className="hero-ctas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            {isAdmin ? (
              <>
                <Link className="btn btn-acid" to="/admin">
                  Create an event <ArrowUpRight size={17} />
                </Link>
                <Link className="btn btn-ghost" to="/admin/coordinators">
                  Manage coordinators <MoveUpRight size={16} />
                </Link>
              </>
            ) : isCoordinator ? (
              <>
                <Link className="btn btn-acid" to="/admin">
                  Create an event <ArrowUpRight size={17} />
                </Link>
                <Link className="btn btn-ghost" to="/events">
                  View events <MoveUpRight size={16} />
                </Link>
              </>

            ) : (
              <>
                <Link className="btn btn-acid" to="/resources">
                  Explore resources <ArrowUpRight size={17} />
                </Link>
                <Link className="btn btn-ghost" to="/events">
                  Join events <MoveUpRight size={16} />
                </Link>
                <a
                  className="btn btn-ghost hero-insta-btn"
                  href="https://www.instagram.com/apticlub_gsss/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    width="16"
                    height="16"
                    src="https://img.icons8.com/fluency/48/instagram-new.png"
                    alt="Instagram"
                    style={{ display: 'block' }}
                  />
                  @apticlub_gsss
                </a>
              </>
            )}
          </motion.div>

          <div className="hero-footnote">
            <span className="mini-avatars">
              <i>✳</i>
              <i>↗</i>
              <i>+</i>
            </span>
            <span>
              {isAdmin ? (
                <>Manage events and<br /><b>support your coordinators.</b></>
              ) : isCoordinator ? (
                <>Plan with purpose<br /><b>bring change to campus.</b></>
              ) : (
                <>Made for the ones who are<br /><b>getting ready for what's next.</b></>
              )}
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-label label-one">
            THINK BIGGER <span>↗</span>
          </div>
          <Scene />
          <div className="visual-sticker">
            READY
            <br />
            WHEN
            <br />
            YOU ARE
            <span>✳</span>
          </div>
          <div className="visual-label label-two">SKILLS IN MOTION / 001</div>
        </div>

        <a
          href={isAdmin ? '#admin-dashboard' : isCoordinator ? '#coordinator-dashboard' : '#tracks'}
          className="scroll-cue"
        >
          <ArrowDown size={15} />
          {isAdmin ? 'SCROLL TO ADMIN TOOLS' : isCoordinator ? 'SCROLL TO COORDINATOR TOOLS' : 'SCROLL TO EXPLORE'}
        </a>
        <div className="hero-index">
          {isAdmin ? 'ADMIN / 01' : isCoordinator ? 'COORDINATOR / 01' : '01 — 04'}
        </div>
      </section>

      {isAdmin ? (
        <AdminHomeDashboard token={token} />
      ) : isCoordinator ? (
        <CoordinatorHomeDashboard token={token} />
      ) : (
        <>
      <section className="ticker">
        <div className="ticker-track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}>
            DREAM<b>✳</b> DISCOVER <b>✳</b> DEFINE <b>✳</b> GET PLACED <b>✳</b>
            </span>
          ))}
        </div>
      </section>
      {upcomingTomorrowEvents.length > 0 && (
  <section className="section-shell upcoming-tomorrow-section">
    <div className="section-heading">
      <div>
        <span className="eyebrow">HAPPENING TOMORROW</span>
        <h2>Don't miss<br /><em>what's next.</em></h2>
      </div>
      <Link to="/events" className="text-link">
        All events <ArrowUpRight size={16} />
      </Link>
    </div>

    <div className="upcoming-tomorrow-list">
      {upcomingTomorrowEvents.map(event => {
        const isRegistered = myRegistrations.some(
          r => Number(r.eventId) === Number(event.id)
        )
        return (
          <article className="upcoming-tomorrow-card" key={event.id}>
                    <div className="upcoming-tomorrow-meta">
                      <span className="upcoming-tomorrow-badge">TOMORROW</span>
                      <span><Clock size={13} /> {String(event.start_time || '').slice(0, 5)}</span>
                      <span><MapPin size={13} /> {event.venue}</span>
                    </div>
                    <h3>{event.title}</h3>
                    {event.description && (
                      <p className="upcoming-tomorrow-desc">{event.description}</p>
                    )}
                    <div className="upcoming-tomorrow-footer">
                      {isRegistered ? (
                        <span className="registered-event-status">REGISTERED ✓</span>
                      ) : (
                        <Link
                          to="/events"
                          state={{ highlight: event.id }}
                          className="btn btn-acid"
                        >
                          Register now <ArrowUpRight size={15} />
                        </Link>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        )}

      {myRegistrations.length > 0 && (
        <section className="section-shell registered-events-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">YOUR UPCOMING PLANS</span>
              <h2>Your registered<br /><em>events.</em></h2>
            </div>
            <Link to="/events" className="text-link">
              Browse events <ArrowUpRight size={16} />
            </Link>
          </div>

          {eventsError ? (
            <div className="form-error">{eventsError}</div>
          ) : registeredEvents.length > 0 ? (
            <div className="registered-event-list">
              {registeredEvents.map(event => (
                <article className="registered-event-row" key={event.id}>
                  <CalendarDays size={20} />
                  <div>
                    <b>{event.title}</b>
                    <span>
                      {formatDate(String(event.event_date).slice(0, 10))}
                      {event.start_time && ` · ${String(event.start_time).slice(0, 5)}`}
                      {event.venue && ` · ${event.venue}`}
                    </span>
                  </div>
                  <span className="registered-event-status">REGISTERED</span>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">Loading your registered events...</div>
          )}
        </section>
      )}

      <section className="section-shell tracks-section" id="tracks">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE TOOLKIT / 01</span>
            <h2>
              <br />
              <em>One big leap.</em>
            </h2>
          </div>
          <p>
            Everything you need to move from “I should start” to “I'm ready.” Pick a track and make
            it yours.
          </p>
        </div>

        <div className="resource-grid">
          {cats.map(([c, t, d], i) => (
            <Link key={c} to="/resources" state={{ category: c }}>
              <ResourceCard category={c} title={t} desc={d} index={i} />
            </Link>
          ))}
        </div>

        <div className="center-link">
          <Link to="/resources" className="text-link">
            Explore all resources <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <section className="event-feature">
        <div className="event-feature-inner">
          <div className="event-feature-copy">
            <span className="eyebrow">GET IN THE ROOM / 02</span>
            <h2>
              Good things
              <br />
              happen <em>in person.</em>
            </h2>
            <p>
              Workshops, practice sessions and community moments. Don't just prepare alone — grow
              together.
            </p>
            <Link className="btn btn-acid" to="/events">
              Find your next event <ArrowUpRight size={17} />
            </Link>
          </div>

          <div className="event-feature-art">
            <div className="event-art-circle">
              <CalendarDays size={70} />
              <span>
                LET'S
                <br />
                MAKE
                <br />
                MOVES.
              </span>
            </div>
            <div className="event-art-tag">
              SHOW UP
              <br />
              CURIOUS ↗
            </div>
          </div>
        </div>
      </section>

      <section className="manifesto section-shell">
        <span className="eyebrow">THE APTI CLUB ENERGY / 03</span>
        <h2>
          Not another tab
          <br />
          you'll <em>forget to open.</em>
        </h2>

        <div className="manifesto-bottom">
          <p>
            A focused space for resources, campus events and the little wins that add up to a big
            offer.
          </p>
          <Link to="/about" className="text-link">
            Get to know us <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="stat-row">
          <div>
            <BookOpen />
            <b>Curated</b>
            <span>Resources that get you moving</span>
          </div>
          <div>
            <Users />
            <b>Community-led</b>
            <span>Learn with your people</span>
          </div>
          <div>
            <Sparkles />
            <b>Future-focused</b>
            <span>Progress over perfection</span>
          </div>
        </div>
      </section>
        </>
      )}
    </>
  )
}