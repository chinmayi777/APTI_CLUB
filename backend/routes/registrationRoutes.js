
import express from 'express';

import {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations
} from '../controllers/registrationController.js';

import {
  authenticateToken,
  authorizeRoles
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get(
  '/my',
  authenticateToken,
  authorizeRoles('student'),
  getMyRegistrations
);

router.post(
  '/:eventId',
  authenticateToken,
  authorizeRoles('student'),
  registerForEvent
);

router.delete(
  '/:eventId',
  authenticateToken,
  authorizeRoles('student'),
  cancelRegistration
);

export default router;
