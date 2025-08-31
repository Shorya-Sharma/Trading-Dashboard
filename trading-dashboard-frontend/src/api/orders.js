import apiClient from './apiClient';

export async function submitOrder(order) {
  try {
    const response = await apiClient.post('/orders', order);
    return response;
  } catch (error) {
    console.error('Failed to submit order:', error);
    throw error;
  }
}
