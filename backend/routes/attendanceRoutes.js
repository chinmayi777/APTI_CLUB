
import express from 'express';

import {
  getEventAttendees,
  markAttendance
} from '../controllers/attendanceController.js';

import {
  authenticateToken,
  authorizeRoles
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get(
  '/:eventId',
  authenticateToken,
  authorizeRoles('admin', 'coordinator'),
  getEventAttendees
);

router.post(
  '/:eventId/mark',
  authenticateToken,
  authorizeRoles('admin', 'coordinator'),
  markAttendance
);

export default router;
