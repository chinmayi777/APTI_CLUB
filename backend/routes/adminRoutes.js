
import express from 'express';

import {
  createCoordinator,
  getCoordinators
} from '../controllers/adminController.js';

import {
  authenticateToken,
  authorizeRoles
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get(
  '/coordinators',
  authenticateToken,
  authorizeRoles('admin'),
  getCoordinators
);

router.post(
  '/coordinators',
  authenticateToken,
  authorizeRoles('admin'),
  createCoordinator
);

export default router;
