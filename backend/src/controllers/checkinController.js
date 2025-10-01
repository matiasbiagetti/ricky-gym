import pool from '../config/database.js';
import { uploadToS3 } from '../utils/s3.js';

// Create a check-in
export const createCheckin = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notes, checkinDate } = req.body;
    const date = checkinDate || new Date().toISOString().split('T')[0];

    // Check if user already checked in today
    const existing = await pool.query(
      'SELECT id FROM checkins WHERE user_id = $1 AND checkin_date = $2',
      [userId, date]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'You have already checked in for this date' });
    }

    let photoUrl = null;
    if (req.file) {
      if (process.env.AWS_S3_BUCKET) {
        photoUrl = await uploadToS3(req.file, `checkin-photos/${userId}`);
      } else {
        photoUrl = `/uploads/checkin-photos/${req.file.filename}`;
      }
    }

    const result = await pool.query(
      'INSERT INTO checkins (user_id, checkin_date, photo_url, notes) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, date, photoUrl, notes]
    );

    res.status(201).json({
      message: 'Check-in successful',
      checkin: {
        id: result.rows[0].id,
        userId: result.rows[0].user_id,
        checkinDate: result.rows[0].checkin_date,
        checkinTime: result.rows[0].checkin_time,
        photoUrl: result.rows[0].photo_url,
        notes: result.rows[0].notes,
        createdAt: result.rows[0].created_at
      }
    });
  } catch (error) {
    console.error('Create check-in error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user check-ins
export const getUserCheckins = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.userId;
    const { startDate, endDate, limit = 30, offset = 0 } = req.query;

    let query = 'SELECT * FROM checkins WHERE user_id = $1';
    const params = [userId];
    let paramCount = 1;

    if (startDate) {
      paramCount++;
      query += ` AND checkin_date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND checkin_date <= $${paramCount}`;
      params.push(endDate);
    }

    query += ' ORDER BY checkin_date DESC, checkin_time DESC';
    
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(parseInt(offset));

    const result = await pool.query(query, params);

    res.json({
      checkins: result.rows.map(checkin => ({
        id: checkin.id,
        userId: checkin.user_id,
        checkinDate: checkin.checkin_date,
        checkinTime: checkin.checkin_time,
        photoUrl: checkin.photo_url,
        notes: checkin.notes,
        createdAt: checkin.created_at
      }))
    });
  } catch (error) {
    console.error('Get user check-ins error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get check-in statistics
export const getCheckinStats = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.userId;
    const { period = 'all' } = req.query; // all, year, month, week

    let dateFilter = '';
    if (period === 'year') {
      dateFilter = "AND checkin_date >= DATE_TRUNC('year', CURRENT_DATE)";
    } else if (period === 'month') {
      dateFilter = "AND checkin_date >= DATE_TRUNC('month', CURRENT_DATE)";
    } else if (period === 'week') {
      dateFilter = "AND checkin_date >= DATE_TRUNC('week', CURRENT_DATE)";
    }

    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_checkins,
        COUNT(DISTINCT checkin_date) as unique_days,
        MIN(checkin_date) as first_checkin,
        MAX(checkin_date) as last_checkin,
        ROUND(COUNT(*)::numeric / NULLIF(EXTRACT(DAY FROM (MAX(checkin_date) - MIN(checkin_date) + INTERVAL '1 day')), 0), 2) as avg_per_day
      FROM checkins 
      WHERE user_id = $1 ${dateFilter}`,
      [userId]
    );

    const stats = result.rows[0];

    // Get checkins by day of week
    const dayOfWeekResult = await pool.query(
      `SELECT 
        TO_CHAR(checkin_date, 'Day') as day_name,
        EXTRACT(DOW FROM checkin_date) as day_num,
        COUNT(*) as count
      FROM checkins 
      WHERE user_id = $1 ${dateFilter}
      GROUP BY day_name, day_num
      ORDER BY day_num`,
      [userId]
    );

    res.json({
      period,
      statistics: {
        totalCheckins: parseInt(stats.total_checkins),
        uniqueDays: parseInt(stats.unique_days),
        firstCheckin: stats.first_checkin,
        lastCheckin: stats.last_checkin,
        avgPerDay: parseFloat(stats.avg_per_day) || 0
      },
      byDayOfWeek: dayOfWeekResult.rows.map(row => ({
        day: row.day_name.trim(),
        count: parseInt(row.count)
      }))
    });
  } catch (error) {
    console.error('Get check-in stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a check-in
export const deleteCheckin = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { checkinId } = req.params;

    const result = await pool.query(
      'DELETE FROM checkins WHERE id = $1 AND user_id = $2 RETURNING id',
      [checkinId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Check-in not found or unauthorized' });
    }

    res.json({ message: 'Check-in deleted successfully' });
  } catch (error) {
    console.error('Delete check-in error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
