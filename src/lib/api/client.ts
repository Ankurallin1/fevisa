import axios from 'axios';
import { handleSessionExpiry, isSessionExpiryError } from '../utils/sessionExpiry';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Client: Making request to:', (config.baseURL || '') + (config.url || ''));
    console.log('API Client: Request method:', config.method);
    console.log('API Client: Request data:', config.data);
    
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Client: Added auth token');
    } else {
      console.log('API Client: No auth token found');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log API response for debugging
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle 401 session expiry globally
    if (isSessionExpiryError(error)) {
      console.log('API Client: 401 error detected, handling session expiry');
      handleSessionExpiry();
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
