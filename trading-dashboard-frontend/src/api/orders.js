import apiClient from './apiClient';

/**
 * Fetch all orders for a given symbol
 * @param {string} symbol - e.g. "NVDA"
 * @returns {Promise<Array>} List of orders
 */
export async function fetchOrders(symbol) {
  const res = await apiClient.get(`/orders?symbol=${symbol}`);
  return res;
}

/**
 * Submit a new order
 * (already used in OrderPage, included for completeness)
 * @param {object} order - { symbol, side, quantity, price }
 * @returns {Promise<object>} Created order with ID
 */
export async function submitOrder(order) {
  const res = await apiClient.post('/orders', order);
  return res;
}
