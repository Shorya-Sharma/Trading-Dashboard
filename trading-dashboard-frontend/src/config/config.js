// API Configuration
export const API_CONFIG = {
  // Base URL for REST API endpoints
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api',

  // WebSocket base URL for real-time data
  WS_BASE_URL:
    process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:8000/ws/ticks',

  // Environment
  ENV: process.env.REACT_APP_ENV || 'development',

  // API endpoints
  ENDPOINTS: {
    ORDERS: '/orders',
    SYMBOLS: '/symbols',
    TICKS: '/ticks',
  },
};

// App Configuration
export const APP_CONFIG = {
  // App title
  TITLE: 'Trading Dashboard',

  // App version
  VERSION: '1.0.0',

  // Default route
  DEFAULT_ROUTE: '/',

  // Navigation settings
  NAVIGATION: {
    DRAWER_WIDTH: 240,
    HEADER_HEIGHT: 80,
  },
};

// Helper function to get full API URL
export const getApiUrl = endpoint => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get WebSocket URL
export const getWsUrl = () => {
  return API_CONFIG.WS_BASE_URL;
};
