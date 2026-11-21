import express from 'express';
import {
  archiveUpload,
  createArchiveItem,
  getArchiveItems,
  updateArchiveItem
} from '../controllers/archiveController.js';
import {
  authenticateToken,
  authorizeRoles
} from '../middleware/authMiddleware.js';

const router = express.Router();

const handleUpload = (req, res, next) => {
  archiveUpload.single('file')(req, res, error => {
    if (error) {
      return res.status(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({
        success: false,
        message: error.code === 'LIMIT_FILE_SIZE'
          ? 'PDF files must be 50 MB or smaller'
          : error.message
      });
    }

    return next();
  });
};

router.get('/', authenticateToken, getArchiveItems);
router.post('/', authenticateToken, authorizeRoles('admin'), handleUpload, createArchiveItem);
router.put('/:id', authenticateToken, authorizeRoles('admin'), handleUpload, updateArchiveItem);

export default router;
