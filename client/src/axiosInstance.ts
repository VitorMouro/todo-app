// src/api/axiosInstance.ts
import axios from 'axios';

// Determine the base URL based on the environment
// IMPORTANT: Replace with your actual backend API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
// Example: If your backend runs on 3000 and routes are under /api -> http://localhost:3000/api

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for sending cookies (like session IDs) with requests
});

// Optional: Add interceptors for request/response handling (e.g., adding auth tokens, error handling)
axiosInstance.interceptors.response.use(
  response => response, // Simply return response if successful
  error => {
    // Handle errors globally (e.g., redirect on 401 Unauthorized)
    console.error('Axios error:', error.response || error.message);
    // Example: if (error.response?.status === 401) { window.location.href = '/login'; }
    return Promise.reject(error);
  }
);

export default axiosInstance;
