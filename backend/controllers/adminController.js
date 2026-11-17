
import bcrypt from 'bcryptjs';
import db from '../config/db.js';

export const getCoordinators = async (req, res) => {
  try {
    const [coordinators] = await db.execute(
      `SELECT
         u.id,
         u.full_name,
         u.usn,
         u.email,
         u.is_active,
         COUNT(e.id) AS events_created,
         COUNT(CASE WHEN e.status = 'published' THEN 1 END) AS events_published
       FROM users u
       LEFT JOIN events e ON e.created_by = u.id
       WHERE u.role = 'coordinator'
       GROUP BY u.id, u.full_name, u.usn, u.email, u.is_active
       ORDER BY u.full_name`
    );

    return res.json({ success: true, coordinators });
  } catch (error) {
    console.error('Coordinator list error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not retrieve coordinators'
    });
  }
};

export const createCoordinator = async (req, res) => {
  try {
    const { full_name, usn, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const passwordHash = await bcrypt.hash(password, 12);

    const [result] = await db.execute(
      `INSERT INTO users
       (full_name, usn, email, password_hash, role)
       VALUES (?, ?, ?, ?, 'coordinator')`,
      [
        full_name.trim(),
        usn?.trim() || null,
        normalizedEmail,
        passwordHash
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Coordinator account created successfully',
      coordinator: {
        id: result.insertId,
        full_name: full_name.trim(),
        usn: usn?.trim() || null,
        email: normalizedEmail,
        role: 'coordinator'
      }
    });

  } catch (error) {
    console.error('Coordinator creation error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Email or USN is already registered'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Could not create coordinator account'
    });
  }
};

export const deleteCoordinator = async (req, res) => {
  try {
    const [result] = await db.execute(
      `UPDATE users
       SET is_active = 0
       WHERE id = ? AND role = 'coordinator' AND is_active = 1`,
      [req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: 'Active coordinator not found'
      });
    }

    return res.json({
      success: true,
      message: 'Coordinator access deleted; event history was retained'
    });
  } catch (error) {
    console.error('Coordinator deletion error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not delete the coordinator'
    });
  }
};
