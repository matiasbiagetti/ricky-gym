import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getUserProfile, updateUserProfile, uploadProfilePhoto, searchUsers } from '../controllers/userController.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

// Get user profile (can get any user's profile)
router.get('/profile/:userId?', authenticateToken, getUserProfile);

// Update current user profile
router.put('/profile', authenticateToken, updateUserProfile);

// Upload profile photo
router.post('/profile/photo', authenticateToken, upload.single('photo'), uploadProfilePhoto);

// Search users
router.get('/search', authenticateToken, searchUsers);

export default router;
