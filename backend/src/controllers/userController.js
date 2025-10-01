import pool from '../config/database.js';
import { uploadToS3 } from '../utils/s3.js';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.userId;

    const result = await pool.query(
      'SELECT id, email, username, full_name, profile_photo_url, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Get user statistics
    const statsResult = await pool.query(
      `SELECT 
        COUNT(*) as total_checkins,
        COUNT(DISTINCT DATE_TRUNC('month', checkin_date)) as months_active,
        MAX(checkin_date) as last_checkin
      FROM checkins WHERE user_id = $1`,
      [userId]
    );

    const stats = statsResult.rows[0];

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
        profilePhotoUrl: user.profile_photo_url,
        createdAt: user.created_at
      },
      statistics: {
        totalCheckins: parseInt(stats.total_checkins),
        monthsActive: parseInt(stats.months_active),
        lastCheckin: stats.last_checkin
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { fullName, username } = req.body;
    const userId = req.user.userId;

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [username, userId]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    const result = await pool.query(
      'UPDATE users SET full_name = COALESCE($1, full_name), username = COALESCE($2, username) WHERE id = $3 RETURNING id, email, username, full_name, profile_photo_url',
      [fullName, username, userId]
    );

    const user = result.rows[0];
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
        profilePhotoUrl: user.profile_photo_url
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Upload profile photo
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.user.userId;
    
    // Upload to S3 (or save locally if S3 is not configured)
    let photoUrl;
    if (process.env.AWS_S3_BUCKET) {
      photoUrl = await uploadToS3(req.file, `profile-photos/${userId}`);
    } else {
      // Save locally for development
      photoUrl = `/uploads/profile-photos/${req.file.filename}`;
    }

    const result = await pool.query(
      'UPDATE users SET profile_photo_url = $1 WHERE id = $2 RETURNING profile_photo_url',
      [photoUrl, userId]
    );

    res.json({
      message: 'Profile photo uploaded successfully',
      photoUrl: result.rows[0].profile_photo_url
    });
  } catch (error) {
    console.error('Upload profile photo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Search users
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const result = await pool.query(
      `SELECT id, username, full_name, profile_photo_url 
       FROM users 
       WHERE username ILIKE $1 OR full_name ILIKE $1
       LIMIT 20`,
      [`%${query}%`]
    );

    res.json({
      users: result.rows.map(user => ({
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        profilePhotoUrl: user.profile_photo_url
      }))
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
