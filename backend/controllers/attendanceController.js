
import db from '../config/db.js';

// View registrations for an event
export const getEventAttendees = async (req, res) => {
  try {
    const [attendees] = await db.execute(
      `SELECT
        r.id AS registration_id,
        u.id AS student_id,
        u.full_name,
        u.usn,
        u.email,
        COALESCE(a.status, 'not_marked') AS attendance_status
       FROM registrations r
       JOIN users u ON r.user_id=u.id
       LEFT JOIN attendance a ON a.registration_id=r.id
       WHERE r.event_id=? AND r.status='registered'
       ORDER BY u.full_name`,
      [req.params.eventId]
    );

    res.json({ success: true, attendees });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Could not retrieve attendees'
    });
  }
};

// Mark or update attendance
export const markAttendance = async (req, res) => {
  try {
    const { registration_id, status } = req.body;

    if (!registration_id || !['present', 'absent'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid registration ID and attendance status are required'
      });
    }

    const [registrations] = await db.execute(
      `SELECT id FROM registrations
       WHERE id=? AND event_id=? AND status='registered'`,
      [registration_id, req.params.eventId]
    );

    if (!registrations.length) {
      return res.status(404).json({
        success: false,
        message: 'Active registration not found for this event'
      });
    }

    await db.execute(
      `INSERT INTO attendance (registration_id, status, marked_by)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
       status=VALUES(status), marked_by=VALUES(marked_by),
       marked_at=CURRENT_TIMESTAMP`,
      [registration_id, status, req.user.id]
    );

    res.json({
      success: true,
      message: 'Attendance marked successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Could not mark attendance'
    });
  }
};
