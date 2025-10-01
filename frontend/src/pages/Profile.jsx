import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService, checkinService } from '../services';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const [profileData, statsData] = await Promise.all([
        userService.getProfile(),
        checkinService.getCheckinStats(null, 'all')
      ]);
      
      setProfile(profileData.user);
      setStats(statsData);
      setFormData({
        fullName: profileData.user.fullName || '',
        username: profileData.user.username || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await userService.updateProfile(formData);
      setProfile(data.user);
      updateUser(data.user);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await userService.uploadProfilePhoto(file);
      setProfile({ ...profile, profilePhotoUrl: data.photoUrl });
      updateUser({ ...user, profilePhotoUrl: data.photoUrl });
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const chartData = stats?.byDayOfWeek || [];

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>

      <div className="profile-grid">
        <div className="card profile-info">
          <div className="profile-photo-section">
            {profile?.profilePhotoUrl ? (
              <img src={profile.profilePhotoUrl} alt="Profile" className="profile-photo" />
            ) : (
              <div className="profile-photo-placeholder">
                {profile?.username?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <label className="btn btn-primary btn-sm">
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {editing ? (
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="button-group">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <h2>{profile?.username}</h2>
              {profile?.fullName && <p>{profile.fullName}</p>}
              <p className="email">{profile?.email}</p>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <h2>Statistics Summary</h2>
          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-value">{stats?.statistics?.totalCheckins || 0}</span>
              <span className="stat-label">Total Check-ins</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats?.statistics?.uniqueDays || 0}</span>
              <span className="stat-label">Unique Days</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats?.statistics?.avgPerDay?.toFixed(2) || 0}</span>
              <span className="stat-label">Average/Day</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Check-ins by Day of Week</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="empty-state">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
