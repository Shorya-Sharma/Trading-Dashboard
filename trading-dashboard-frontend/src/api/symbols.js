import apiClient from '../api/apiClient';

/**
 * Fetch a list of symbols from the backend API.
 * Makes a GET request to /symbols and returns the response data.
 * Logs and rethrows errors if the request fails.
 */
export async function fetchSymbols() {
  try {
    const symbols = await apiClient.get('/symbols');
    return symbols;
  } catch (error) {
    console.error('Failed to fetch symbols:', error);
    throw error;
  }
}
