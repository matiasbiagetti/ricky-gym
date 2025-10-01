import api from './api';

export const authService = {
  signup: async (data) => {
    const response = await api.post('/auth/signup', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export const userService = {
  getProfile: async (userId) => {
    const url = userId ? `/users/profile/${userId}` : '/users/profile';
    const response = await api.get(url);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  uploadProfilePhoto: async (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await api.post('/users/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  searchUsers: async (query) => {
    const response = await api.get('/users/search', { params: { query } });
    return response.data;
  }
};

export const checkinService = {
  createCheckin: async (data, photo) => {
    const formData = new FormData();
    if (photo) formData.append('photo', photo);
    if (data.notes) formData.append('notes', data.notes);
    if (data.checkinDate) formData.append('checkinDate', data.checkinDate);

    const response = await api.post('/checkins', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getUserCheckins: async (userId, params) => {
    const url = userId ? `/checkins/user/${userId}` : '/checkins/user';
    const response = await api.get(url, { params });
    return response.data;
  },

  getCheckinStats: async (userId, period) => {
    const url = userId ? `/checkins/stats/${userId}` : '/checkins/stats';
    const response = await api.get(url, { params: { period } });
    return response.data;
  },

  deleteCheckin: async (checkinId) => {
    const response = await api.delete(`/checkins/${checkinId}`);
    return response.data;
  }
};

export const friendService = {
  sendFriendRequest: async (friendId) => {
    const response = await api.post('/friends/request', { friendId });
    return response.data;
  },

  respondToFriendRequest: async (friendshipId, status) => {
    const response = await api.put(`/friends/request/${friendshipId}`, { status });
    return response.data;
  },

  getFriends: async () => {
    const response = await api.get('/friends');
    return response.data;
  },

  getPendingRequests: async () => {
    const response = await api.get('/friends/pending');
    return response.data;
  },

  removeFriend: async (friendshipId) => {
    const response = await api.delete(`/friends/${friendshipId}`);
    return response.data;
  }
};

export const leaderboardService = {
  getLeaderboard: async (params) => {
    const response = await api.get('/leaderboard', { params });
    return response.data;
  },

  getGroupStats: async (period) => {
    const response = await api.get('/leaderboard/group-stats', { params: { period } });
    return response.data;
  }
};
