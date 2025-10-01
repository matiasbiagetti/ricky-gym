import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { sendFriendRequest, respondToFriendRequest, getFriends, getPendingRequests, removeFriend } from '../controllers/friendController.js';

const router = express.Router();

// Send friend request
router.post('/request', authenticateToken, sendFriendRequest);

// Respond to friend request
router.put('/request/:friendshipId', authenticateToken, respondToFriendRequest);

// Get friends list
router.get('/', authenticateToken, getFriends);

// Get pending requests
router.get('/pending', authenticateToken, getPendingRequests);

// Remove friend
router.delete('/:friendshipId', authenticateToken, removeFriend);

export default router;
