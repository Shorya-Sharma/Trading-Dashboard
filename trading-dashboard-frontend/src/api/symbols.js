import apiClient from '../api/apiClient';

export async function fetchSymbols() {
  try {
    const symbols = await apiClient.get('/symbols');
    return symbols;
  } catch (error) {
    console.error('Failed to fetch symbols:', error);
    throw error;
  }
}
