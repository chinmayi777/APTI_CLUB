
import db from '../config/db.js';


// Get published events
export const getEvents = async (req, res) => {
  try {
    const [events] = await db.execute(
      `SELECT
         e.*,
         u.full_name AS created_by_name,
         (
           SELECT COUNT(*)
           FROM registrations r
           WHERE r.event_id = e.id
           AND r.status = 'registered'
         ) AS registered_count
       FROM events e
       JOIN users u ON e.created_by = u.id
       WHERE e.status = 'published'
       ORDER BY e.event_date ASC`
    );

    res.json({
      success: true,
      events
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Could not retrieve events'
    });
  }
};

// Admins and coordinators need to manage drafts as well as published events.
export const getManageEvents = async (req, res) => {
  try {
    const [events] = await db.execute(
      `SELECT
         e.*,
         u.full_name AS created_by_name,
         (
           SELECT COUNT(*)
           FROM registrations r
           WHERE r.event_id = e.id
           AND r.status = 'registered'
         ) AS registered_count
       FROM events e
       JOIN users u ON e.created_by = u.id
       ORDER BY e.event_date ASC`
    );

    res.json({ success: true, events });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Could not retrieve events for management'
    });
  }
};


// Create event
export const createEvent = async (req, res) => {
  try {
    const {
      title, wing, description, venue, event_date,
      start_time, end_time, registration_deadline, capacity
    } = req.body;
    const allowedWings = [
      'aptitude',
      'personality',
      'technical',
      'interview'
    ];

    if (!allowedWings.includes(wing)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid event wing'
      });
    }
    if (!title || !venue || !event_date || !start_time ||
        !end_time || !registration_deadline || capacity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required event details'
      });
    }

    if (!Number.isInteger(Number(capacity)) || Number(capacity) < 1) {
      return res.status(400).json({
        success: false,
        message: 'Capacity must be a positive whole number'
      });
    }

    const [result] = await db.execute(
  `INSERT INTO events
   (title, wing, description, venue, event_date, start_time,
    end_time, registration_deadline, capacity, status, created_by)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?)`,
  [
    title.trim(), wing, description || null, venue.trim(),
    event_date, start_time, end_time,
    registration_deadline, Number(capacity), req.user.id
  ]
);

    res.status(201).json({
      success: true,
      message: 'Event created as draft',
      eventId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Could not create event'
    });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, wing, description, venue, event_date,
      start_time, end_time, registration_deadline, capacity
    } = req.body;
    const allowedWings = [
  'aptitude',
  'personality',
  'technical',
  'interview'
];

if (!allowedWings.includes(wing)) {
  return res.status(400).json({
    success: false,
    message: 'Please select a valid event wing'
  });
}
    if (!title || !venue || !event_date || !start_time ||
        !end_time || !registration_deadline || capacity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All required event details must be provided'
      });
    }

    if (!Number.isInteger(Number(capacity)) || Number(capacity) < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid capacity'
      });
    }

    const [result] = await db.execute(
  `UPDATE events
   SET title=?, wing=?, description=?, venue=?, event_date=?,
       start_time=?, end_time=?, registration_deadline=?, capacity=?
   WHERE id=? AND status IN ('draft', 'published')`,
  [
    title.trim(), wing, description || null, venue.trim(),
    event_date, start_time, end_time,
    registration_deadline, Number(capacity), id
  ]
);
    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or cannot be edited'
      });
    }

    res.json({ success: true, message: 'Event updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Could not update event'
    });
  }
};

// Change event status
export const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['draft', 'published', 'cancelled', 'completed'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event status'
      });
    }

    const [result] = await db.execute(
      'UPDATE events SET status=? WHERE id=?',
      [status, req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({ success: true, message: 'Event status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Could not update event status'
    });
  }
};

export const deleteEvent = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [events] = await connection.execute(
      'SELECT id FROM events WHERE id=? FOR UPDATE',
      [req.params.id]
    );

    if (!events.length) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await connection.execute(
      `DELETE a FROM attendance a
       INNER JOIN registrations r ON r.id = a.registration_id
       WHERE r.event_id = ?`,
      [req.params.id]
    );
    await connection.execute(
      'DELETE FROM registrations WHERE event_id=?',
      [req.params.id]
    );
    await connection.execute(
      'DELETE FROM events WHERE id=?',
      [req.params.id]
    );

    await connection.commit();
    return res.json({
      success: true,
      message: 'Event and its registrations were deleted successfully'
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Could not delete the event'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
