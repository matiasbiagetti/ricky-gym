import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { checkinService, leaderboardService } from '../services';
import CheckinForm from '../components/CheckinForm';
import CheckinList from '../components/CheckinList';
import StatsCard from '../components/StatsCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, checkinsData, leaderboardData] = await Promise.all([
        checkinService.getCheckinStats(null, period),
        checkinService.getUserCheckins(null, { limit: 10 }),
        leaderboardService.getLeaderboard({ period, limit: 5 })
      ]);
      
      setStats(statsData.statistics);
      setCheckins(checkinsData.checkins);
      setLeaderboard(leaderboardData.leaderboard);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckinSuccess = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.username}! 💪</h1>
        <p>Track your progress and compete with friends</p>
      </div>

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
          className={`btn ${period === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setPeriod('all')}
        >
          All Time
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <CheckinForm onSuccess={handleCheckinSuccess} />
          
          <div className="card">
            <h2>Your Statistics</h2>
            <div className="stats-grid">
              <StatsCard 
                title="Total Check-ins" 
                value={stats?.totalCheckins || 0}
                icon="✓"
              />
              <StatsCard 
                title="Unique Days" 
                value={stats?.uniqueDays || 0}
                icon="📅"
              />
              <StatsCard 
                title="Average/Day" 
                value={stats?.avgPerDay?.toFixed(2) || 0}
                icon="📊"
              />
            </div>
          </div>

          <CheckinList checkins={checkins} onDelete={fetchData} />
        </div>

        <div className="dashboard-sidebar">
          <div className="card">
            <h2>Leaderboard 🏆</h2>
            {leaderboard.length > 0 ? (
              <div className="leaderboard-list">
                {leaderboard.map((entry) => (
                  <div key={entry.user.id} className="leaderboard-item">
                    <span className="rank">#{entry.rank}</span>
                    <div className="user-info">
                      <strong>{entry.user.username}</strong>
                      <small>{entry.checkinCount} check-ins</small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
