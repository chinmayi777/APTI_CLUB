
import express from 'express';

import { signup, login } from '../controllers/authController.js';

import {
  authenticateToken
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// Get the currently logged-in user's details
router.get('/me', authenticateToken, (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({
    success: true,
    user: req.user
  });
});

export default router;
