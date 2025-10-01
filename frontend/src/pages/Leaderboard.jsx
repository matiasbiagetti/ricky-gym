import React, { useState, useEffect } from 'react';
import { leaderboardService } from '../services';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [period, setPeriod] = useState('month');
  const [friendsOnly, setFriendsOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [period, friendsOnly]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await leaderboardService.getLeaderboard({
        period,
        friendsOnly: friendsOnly.toString(),
        limit: 50
      });
      setLeaderboard(data.leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (rank) => {
    switch(rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return null;
    }
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1>Leaderboard 🏆</h1>
        <p>See who's crushing their fitness goals</p>
      </div>

      <div className="leaderboard-controls">
        <div className="period-selector">
          <button 
            className={`btn ${period === 'week' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setPeriod('week')}
          >
            This Week
          </button>
          <button 
            className={`btn ${period === 'month' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setPeriod('month')}
          >
            This Month
          </button>
          <button 
            className={`btn ${period === 'year' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setPeriod('year')}
          >
            This Year
          </button>
          <button 
            className={`btn ${period === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setPeriod('all')}
          >
            All Time
          </button>
        </div>

        <div className="filter-toggle">
          <label>
            <input
              type="checkbox"
              checked={friendsOnly}
              onChange={(e) => setFriendsOnly(e.target.checked)}
            />
            <span>Friends Only</span>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="card">
          {leaderboard.length > 0 ? (
            <div className="leaderboard-table">
              {leaderboard.map((entry) => (
                <div key={entry.user.id} className="leaderboard-row">
                  <div className="rank-column">
                    {getMedalEmoji(entry.rank) || `#${entry.rank}`}
                  </div>
                  
                  <div className="user-column">
                    {entry.user.profilePhotoUrl && (
                      <img 
                        src={entry.user.profilePhotoUrl} 
                        alt={entry.user.username}
                        className="user-avatar"
                      />
                    )}
                    <div className="user-details">
                      <div className="username">{entry.user.username}</div>
                      {entry.user.fullName && (
                        <div className="fullname">{entry.user.fullName}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="stats-column">
                    <div className="stat">
                      <span className="stat-value">{entry.checkinCount}</span>
                      <span className="stat-label">check-ins</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{entry.uniqueDays}</span>
                      <span className="stat-label">unique days</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No data available for this period</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
