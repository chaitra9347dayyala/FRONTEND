import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useAuth } from '../context/authcontext';

// Create instance
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Attach token and handle expiration
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // Token expired
      if (decoded.exp < currentTime) {
        localStorage.removeItem('token');
        window.alert('Session expired due to inactivity');
        window.location.href = '/'; // redirect to login
        return Promise.reject(new Error('Session expired'));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
