
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

// STUDENT SIGNUP
export const signup = async (req, res) => {
  try {
    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: 'A request body is required. Send signup data as JSON.'
      });
    }

    const { full_name, usn, email, password } = body;

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

    const [existing] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [normalizedEmail]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Role is ALWAYS student for public signup.
    // Never accept a role from req.body.
    const [result] = await db.execute(
      `INSERT INTO users
       (full_name, usn, email, password_hash, role)
       VALUES (?, ?, ?, ?, 'student')`,
      [
        full_name.trim(),
        usn?.trim() || null,
        normalizedEmail,
        passwordHash
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Student account created successfully',
      user: {
        id: result.insertId,
        full_name: full_name.trim(),
        usn: usn?.trim() || null,
        email: normalizedEmail,
        role: 'student'
      }
    });

  } catch (error) {
    console.error('Signup error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Email or USN is already registered'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Something went wrong during signup'
    });
  }
};


// LOGIN
export const login = async (req, res) => {
  try {
    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: 'A request body is required. Send login data as JSON.'
      });
    }

    const { email, password } = body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [users] = await db.execute(
      `SELECT id, full_name, usn, email,
              password_hash, role, is_active
       FROM users
       WHERE email = ?`,
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account is inactive. Contact the administrator.'
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { sub: String(user.id) },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        usn: user.usn,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong during login'
    });
  }
};
