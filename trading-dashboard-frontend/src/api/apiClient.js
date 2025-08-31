import axios from 'axios';
import { API_CONFIG } from '../config/config';

// Create a reusable Axios client with base URL and default headers
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * - Runs before every API request is sent
 * - Can be used to attach authentication tokens or modify config
 */
apiClient.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - Runs after every API response is received
 * - Extracts response data for easier use
 * - Handles different types of errors (API, Network, Unexpected)
 */
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        message: error.response.data?.error || error.message,
      });
    } else if (error.request) {
      console.error('Network Error: No response received');
    } else {
      console.error('Unexpected Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
