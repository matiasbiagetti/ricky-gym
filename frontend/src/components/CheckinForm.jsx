import React, { useState } from 'react';
import { checkinService } from '../services';
import './CheckinForm.css';

const CheckinForm = ({ onSuccess }) => {
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await checkinService.createCheckin({ notes }, photo);
      setSuccess('Check-in successful! 🎉');
      setNotes('');
      setPhoto(null);
      setPhotoPreview(null);
      if (onSuccess) onSuccess();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to check in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card checkin-form">
      <h2>Daily Check-in 💪</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How was your workout today?"
            rows="3"
          />
        </div>

        <div className="input-group">
          <label htmlFor="photo">Add Photo (Optional)</label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
          />
          {photoPreview && (
            <div className="photo-preview">
              <img src={photoPreview} alt="Preview" />
              <button 
                type="button" 
                onClick={() => {
                  setPhoto(null);
                  setPhotoPreview(null);
                }}
                className="btn-remove"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <button type="submit" className="btn btn-success btn-full" disabled={loading}>
          {loading ? 'Checking in...' : 'Check In Today'}
        </button>
      </form>
    </div>
  );
};

export default CheckinForm;
