import { configureStore } from '@reduxjs/toolkit';
import symbolsReducer from './symbolsSlice';

export const store = configureStore({
  reducer: {
    symbols: symbolsReducer,
  },
});
