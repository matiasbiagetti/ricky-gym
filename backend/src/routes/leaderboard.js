import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getLeaderboard, getGroupStats } from '../controllers/leaderboardController.js';

const router = express.Router();

// Get leaderboard
router.get('/', authenticateToken, getLeaderboard);

// Get group statistics
router.get('/group-stats', authenticateToken, getGroupStats);

export default router;
