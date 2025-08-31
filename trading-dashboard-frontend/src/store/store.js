import { configureStore } from '@reduxjs/toolkit';
import symbolsReducer from './symbolsSlice';
import notificationReducer from './notificationSlice';

/**
 * Redux store configuration.
 * - Combines symbols and notification reducers
 * - Provides centralized state management for the app
 */
export const store = configureStore({
  reducer: {
    symbols: symbolsReducer,
    notification: notificationReducer,
  },
});
