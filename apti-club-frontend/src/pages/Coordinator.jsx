import React from 'react'
import { Navigate } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { useApp } from '../context'

export default function Coordinator() {
  const { user, events, registrations, attendance, markAttendance } = useApp()

  if (!user || !['admin', 'coordinator'].includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="page-shell">
      <div className="page-hero compact">
        <span className="eyebrow">CHECK-IN DESK / COORDINATOR</span>
        <h1>Who's <em>in the room?</em></h1>
        <p>Mark attendance for students who registered and actually attended.</p>
      </div>

      {events.map(event => {
        const eventRegistrations = registrations.filter(
          registration => registration.eventId === event.id
        )

        return (
          <section className="attendance-card" key={event.id}>
            <div className="attendance-head">
              <div>
                <span className="eyebrow">{event.date} · {event.venue}</span>
                <h2>{event.title}</h2>
              </div>
              <span className="role-pill">{eventRegistrations.length} registered</span>
            </div>

            {eventRegistrations.length === 0 ? (
              <p className="muted">No registrations yet.</p>
            ) : (
              eventRegistrations.map(registration => {
                const markedAttendance = attendance.find(
                  item => item.eventId === event.id && item.usn === registration.usn
                )
                const status = markedAttendance?.status

                return (
                  <div className="attendee-row" key={registration.usn}>
                    <div>
                      <b>{registration.name}</b>
                      <span>{registration.usn}</span>
                    </div>
                    <div className="attendance-actions">
                      <span className={`attendance-status ${
                        status === 'Present' ? 'present' : status === 'Absent' ? 'absent' : 'pending'
                      }`}>
                        {status || 'Unmarked'}
                      </span>
                      <button
                        className="mark-present"
                        onClick={() => markAttendance(event.id, registration.usn, 'Present')}
                        title="Mark present"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        className="mark-absent"
                        onClick={() => markAttendance(event.id, registration.usn, 'Absent')}
                        title="Mark absent"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </section>
        )
      })}
    </div>
  )
}
