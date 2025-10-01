import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createCheckin, getUserCheckins, getCheckinStats, deleteCheckin } from '../controllers/checkinController.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

// Create check-in
router.post('/', authenticateToken, upload.single('photo'), createCheckin);

// Get user check-ins
router.get('/user/:userId?', authenticateToken, getUserCheckins);

// Get check-in statistics
router.get('/stats/:userId?', authenticateToken, getCheckinStats);

// Delete check-in
router.delete('/:checkinId', authenticateToken, deleteCheckin);

export default router;
