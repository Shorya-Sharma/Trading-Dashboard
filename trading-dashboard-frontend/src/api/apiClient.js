import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

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
