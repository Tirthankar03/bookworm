import axios from 'axios';
import { getToken, deleteToken } from '../utils/secureStorage';

console.log("process.env.EXPO_PUBLIC_API_URL>>>", process.env.EXPO_PUBLIC_API_URL)

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token and user data
      await deleteToken();
    }
    return Promise.reject(error);
  }
);

export default api; 