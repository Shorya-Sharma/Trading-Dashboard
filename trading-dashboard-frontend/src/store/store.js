import { configureStore } from '@reduxjs/toolkit';
import symbolsReducer from './symbolsSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    symbols: symbolsReducer,
    notification: notificationReducer,
  },
});
