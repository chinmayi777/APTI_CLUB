
import db from '../config/db.js';

// Register student for an event
export const registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;

    const [events] = await db.execute(
      `SELECT id, capacity, registration_deadline, status
       FROM events WHERE id=?`,
      [eventId]
    );

    if (!events.length || events[0].status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Published event not found'
      });
    }

    const event = events[0];

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [lockedEvents] = await connection.execute(
        `SELECT capacity, registration_deadline, status
         FROM events WHERE id=? FOR UPDATE`,
        [eventId]
      );

      if (!lockedEvents.length ||
          lockedEvents[0].status !== 'published' ||
          new Date(lockedEvents[0].registration_deadline) < new Date()) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Registration is closed'
        });
      }

      const [existing] = await connection.execute(
        `SELECT id, status FROM registrations
         WHERE user_id=? AND event_id=?`,
        [userId, eventId]
      );

      if (existing.length && existing[0].status === 'registered') {
        await connection.rollback();
        return res.status(409).json({
          success: false,
          message: 'Already registered for this event'
        });
      }

      const [count] = await connection.execute(
        `SELECT COUNT(*) AS total FROM registrations
         WHERE event_id=? AND status='registered'`,
        [eventId]
      );

      if (count[0].total >= lockedEvents[0].capacity) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Event capacity is full'
        });
      }

      if (existing.length) {
        await connection.execute(
          `UPDATE registrations SET status='registered',
           registered_at=NOW() WHERE id=?`,
          [existing[0].id]
        );
      } else {
        await connection.execute(
          `INSERT INTO registrations (user_id, event_id, status)
           VALUES (?, ?, 'registered')`,
          [userId, eventId]
        );
      }

      await connection.commit();

      res.status(201).json({
        success: true,
        message: 'Successfully registered for event'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

// Cancel registration
export const cancelRegistration = async (req, res) => {
  try {
    const [result] = await db.execute(
      `UPDATE registrations
       SET status='cancelled'
       WHERE user_id=? AND event_id=? AND status='registered'`,
      [req.user.id, req.params.eventId]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: 'Active registration not found'
      });
    }

    res.json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Could not cancel registration'
    });
  }
};

// Get current student's registrations
export const getMyRegistrations = async (req, res) => {
  try {
    const [registrations] = await db.execute(
      `SELECT r.id AS registration_id, r.status AS registration_status,
              r.registered_at, e.id AS event_id, e.title, e.venue,
              e.event_date, e.start_time, e.end_time
       FROM registrations r
       JOIN events e ON r.event_id=e.id
       WHERE r.user_id=?
       ORDER BY r.registered_at DESC`,
      [req.user.id]
    );

    res.json({ success: true, registrations });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Could not retrieve registrations'
    });
  }
};
