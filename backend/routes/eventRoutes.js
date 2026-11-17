
import express from 'express';

import {
  getEvents,
  getManageEvents,
  createEvent,
  updateEvent,
  updateEventStatus,
  deleteEvent
} from '../controllers/eventController.js';

import {
  authenticateToken,
  authorizeRoles
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Published events can be viewed publicly
router.get('/', getEvents);

// Only staff can see drafts and manage publication.
router.get(
  '/manage',
  authenticateToken,
  authorizeRoles('admin', 'coordinator'),
  getManageEvents
);

// Admin and Coordinator can create events
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'coordinator'),
  createEvent
);

// Admin and Coordinator can update events
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'coordinator'),
  updateEvent
);

// Only Admin can change event status
router.patch(
  '/:id/status',
  authenticateToken,
  authorizeRoles('admin'),
  updateEventStatus
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'coordinator'),
  deleteEvent
);

export default router;
