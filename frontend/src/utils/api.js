import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (config.url?.includes('/clipboard')) {
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        config.headers['auth-token'] = token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const clipboardAPI = {
  createClipboard: async (text, tags = []) => {
    try {
      const response = await api.post('/clipboard', { text, tags });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to share content';
    }
  },

  getClipboard: async (code) => {
    try {
      const response = await api.get(`/clipboard/${code}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to retrieve content';
    }
  },

  getUserClipboards: async () => {
    try {
      const response = await api.get('/clipboard');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch clipboard history';
    }
  },
};

export default api;