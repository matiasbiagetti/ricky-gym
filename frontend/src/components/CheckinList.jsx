import React from 'react';
import { checkinService } from '../services';
import './CheckinList.css';

const CheckinList = ({ checkins, onDelete }) => {
  const handleDelete = async (checkinId) => {
    if (!window.confirm('Are you sure you want to delete this check-in?')) {
      return;
    }

    try {
      await checkinService.deleteCheckin(checkinId);
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error deleting check-in:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="card">
      <h2>Recent Check-ins</h2>
      {checkins.length > 0 ? (
        <div className="checkin-list">
          {checkins.map((checkin) => (
            <div key={checkin.id} className="checkin-item">
              <div className="checkin-date">
                <span className="date">{formatDate(checkin.checkinDate)}</span>
                {checkin.checkinTime && (
                  <span className="time">{checkin.checkinTime}</span>
                )}
              </div>
              
              <div className="checkin-content">
                {checkin.photoUrl && (
                  <img 
                    src={checkin.photoUrl} 
                    alt="Check-in" 
                    className="checkin-photo"
                  />
                )}
                {checkin.notes && (
                  <p className="checkin-notes">{checkin.notes}</p>
                )}
              </div>

              <button 
                onClick={() => handleDelete(checkin.id)}
                className="btn-delete"
                title="Delete check-in"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-state">No check-ins yet. Start tracking your progress!</p>
      )}
    </div>
  );
};

export default CheckinList;
