import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
