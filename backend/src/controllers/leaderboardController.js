import pool from '../config/database.js';

// Get leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const { period = 'month', limit = 50 } = req.query; // all, year, month, week
    const userId = req.user.userId;

    let dateFilter = '';
    if (period === 'year') {
      dateFilter = "AND c.checkin_date >= DATE_TRUNC('year', CURRENT_DATE)";
    } else if (period === 'month') {
      dateFilter = "AND c.checkin_date >= DATE_TRUNC('month', CURRENT_DATE)";
    } else if (period === 'week') {
      dateFilter = "AND c.checkin_date >= DATE_TRUNC('week', CURRENT_DATE)";
    }

    // Get leaderboard with friends filter option
    const { friendsOnly } = req.query;
    let friendsFilter = '';
    
    if (friendsOnly === 'true') {
      friendsFilter = `AND (u.id = $2 OR EXISTS (
        SELECT 1 FROM friendships f 
        WHERE ((f.user_id = $2 AND f.friend_id = u.id) OR (f.friend_id = $2 AND f.user_id = u.id))
        AND f.status = 'accepted'
      ))`;
    }

    const query = `
      SELECT 
        u.id,
        u.username,
        u.full_name,
        u.profile_photo_url,
        COUNT(c.id) as checkin_count,
        COUNT(DISTINCT c.checkin_date) as unique_days,
        RANK() OVER (ORDER BY COUNT(c.id) DESC) as rank
      FROM users u
      LEFT JOIN checkins c ON u.id = c.user_id ${dateFilter}
      WHERE 1=1 ${friendsFilter}
      GROUP BY u.id, u.username, u.full_name, u.profile_photo_url
      ORDER BY checkin_count DESC, u.username
      LIMIT $1
    `;

    const params = friendsOnly === 'true' ? [parseInt(limit), userId] : [parseInt(limit)];
    const result = await pool.query(query, params);

    res.json({
      period,
      leaderboard: result.rows.map(row => ({
        rank: parseInt(row.rank),
        user: {
          id: row.id,
          username: row.username,
          fullName: row.full_name,
          profilePhotoUrl: row.profile_photo_url
        },
        checkinCount: parseInt(row.checkin_count),
        uniqueDays: parseInt(row.unique_days)
      }))
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get group statistics (for friends)
export const getGroupStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { period = 'month' } = req.query;

    let dateFilter = '';
    if (period === 'year') {
      dateFilter = "AND c.checkin_date >= DATE_TRUNC('year', CURRENT_DATE)";
    } else if (period === 'month') {
      dateFilter = "AND c.checkin_date >= DATE_TRUNC('month', CURRENT_DATE)";
    } else if (period === 'week') {
      dateFilter = "AND c.checkin_date >= DATE_TRUNC('week', CURRENT_DATE)";
    }

    // Get statistics for user and their friends
    const result = await pool.query(
      `SELECT 
        COUNT(DISTINCT c.user_id) as active_members,
        COUNT(c.id) as total_checkins,
        ROUND(AVG(user_checkins.count), 2) as avg_checkins_per_user
      FROM (
        SELECT u.id
        FROM users u
        WHERE u.id = $1 OR EXISTS (
          SELECT 1 FROM friendships f 
          WHERE ((f.user_id = $1 AND f.friend_id = u.id) OR (f.friend_id = $1 AND f.user_id = u.id))
          AND f.status = 'accepted'
        )
      ) group_users
      LEFT JOIN checkins c ON c.user_id = group_users.id ${dateFilter}
      LEFT JOIN LATERAL (
        SELECT COUNT(*) as count
        FROM checkins
        WHERE user_id = group_users.id ${dateFilter}
      ) user_checkins ON true`,
      [userId]
    );

    const stats = result.rows[0];

    res.json({
      period,
      groupStatistics: {
        activeMembers: parseInt(stats.active_members),
        totalCheckins: parseInt(stats.total_checkins),
        avgCheckinsPerUser: parseFloat(stats.avg_checkins_per_user) || 0
      }
    });
  } catch (error) {
    console.error('Get group stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
