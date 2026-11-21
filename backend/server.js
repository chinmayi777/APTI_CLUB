
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import archiveRoutes from './routes/archiveRoutes.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log('METHOD:', req.method);
  console.log('URL:', req.url);
  console.log('CONTENT TYPE:', req.headers['content-type']);
  next();
});

// Basic server route
app.get('/', (req, res) => {
  res.send('Apti Club Backend is running!');
});

// Database health check
app.get('/api/health/db', async (req, res) => {
  try {
    const [result] = await db.query('SELECT 1 AS connected');

    res.json({
      success: true,
      message: 'MySQL connected successfully!',
      database: result[0].connected
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Database connection failed'
    });
  }
});

// Authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/archive', archiveRoutes);
app.use(
  '/archive-files',
  express.static(path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'uploads/archive'))
);

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is missing from .env');
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
