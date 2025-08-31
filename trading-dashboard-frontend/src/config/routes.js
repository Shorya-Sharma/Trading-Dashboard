import DashboardPage from '../pages/DashboardPage';
import SymbolsPage from '../pages/SymbolsPage';
import CreateOrderPage from '../pages/CreateOrderPage';
import OrdersTablePage from '../pages/OrdersTablePage';

// Route configuration object
export const ROUTES = {
  // Dashboard route (home page)
  DASHBOARD: {
    path: '/',
    element: DashboardPage,
    label: 'Dashboard',
    description: 'Main trading dashboard view',
  },

  // Symbols management route
  SYMBOLS: {
    path: '/symbols',
    element: SymbolsPage,
    label: 'Symbols',
    description: 'Manage trading symbols and watchlists',
  },

  // Order creation route
  CREATE_ORDER: {
    path: '/create-order',
    element: CreateOrderPage,
    label: 'Create Order',
    description: 'Create new trading orders',
  },

  // Orders Table route
  ORDERS_TABLE: {
    path: '/orders-table',
    element: OrdersTablePage,
    label: 'Orders Table',
    description: 'View and manage all orders in a tabular format',
  },
};

// Helper function to get route by path
export const getRouteByPath = path => {
  return Object.values(ROUTES).find(route => route.path === path);
};

// Helper function to get all route paths
export const getAllRoutePaths = () => {
  return Object.values(ROUTES).map(route => route.path);
};

// Helper function to get route labels for navigation
export const getRouteLabels = () => {
  return Object.values(ROUTES).map(route => ({
    path: route.path,
    label: route.label,
  }));
};
