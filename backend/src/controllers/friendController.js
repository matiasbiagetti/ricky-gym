import pool from '../config/database.js';

// Send friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { friendId } = req.body;

    if (userId === friendId) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    // Check if friendship already exists
    const existing = await pool.query(
      'SELECT * FROM friendships WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)',
      [userId, friendId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Friend request already exists' });
    }

    // Check if friend exists
    const friendExists = await pool.query('SELECT id FROM users WHERE id = $1', [friendId]);
    if (friendExists.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const result = await pool.query(
      'INSERT INTO friendships (user_id, friend_id, status) VALUES ($1, $2, $3) RETURNING *',
      [userId, friendId, 'pending']
    );

    res.status(201).json({
      message: 'Friend request sent',
      friendship: {
        id: result.rows[0].id,
        userId: result.rows[0].user_id,
        friendId: result.rows[0].friend_id,
        status: result.rows[0].status,
        createdAt: result.rows[0].created_at
      }
    });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Respond to friend request
export const respondToFriendRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { friendshipId } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(
      'UPDATE friendships SET status = $1 WHERE id = $2 AND friend_id = $3 AND status = $4 RETURNING *',
      [status, friendshipId, userId, 'pending']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Friend request not found or already processed' });
    }

    res.json({
      message: `Friend request ${status}`,
      friendship: {
        id: result.rows[0].id,
        userId: result.rows[0].user_id,
        friendId: result.rows[0].friend_id,
        status: result.rows[0].status
      }
    });
  } catch (error) {
    console.error('Respond to friend request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get friends list
export const getFriends = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT 
        u.id, u.username, u.full_name, u.profile_photo_url,
        f.id as friendship_id, f.status
      FROM friendships f
      JOIN users u ON (
        CASE 
          WHEN f.user_id = $1 THEN u.id = f.friend_id
          ELSE u.id = f.user_id
        END
      )
      WHERE (f.user_id = $1 OR f.friend_id = $1) AND f.status = 'accepted'
      ORDER BY u.username`,
      [userId]
    );

    res.json({
      friends: result.rows.map(row => ({
        friendshipId: row.friendship_id,
        user: {
          id: row.id,
          username: row.username,
          fullName: row.full_name,
          profilePhotoUrl: row.profile_photo_url
        }
      }))
    });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get pending friend requests
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT 
        f.id as friendship_id,
        u.id, u.username, u.full_name, u.profile_photo_url,
        f.created_at
      FROM friendships f
      JOIN users u ON u.id = f.user_id
      WHERE f.friend_id = $1 AND f.status = 'pending'
      ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json({
      requests: result.rows.map(row => ({
        friendshipId: row.friendship_id,
        user: {
          id: row.id,
          username: row.username,
          fullName: row.full_name,
          profilePhotoUrl: row.profile_photo_url
        },
        createdAt: row.created_at
      }))
    });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove friend
export const removeFriend = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { friendshipId } = req.params;

    const result = await pool.query(
      'DELETE FROM friendships WHERE id = $1 AND (user_id = $2 OR friend_id = $2) RETURNING id',
      [friendshipId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Friendship not found' });
    }

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
