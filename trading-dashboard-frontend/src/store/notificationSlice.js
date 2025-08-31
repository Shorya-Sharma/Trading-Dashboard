import { createSlice } from '@reduxjs/toolkit';

export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
};

/**
 * Redux slice for managing global notifications.
 * - Stores open state, message, and type (success or error)
 * - Provides reducers to show and hide notifications
 */
const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    open: false,
    message: '',
    type: NotificationType.SUCCESS,
  },
  reducers: {
    showNotification: (state, action) => {
      state.open = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    hideNotification: state => {
      state.open = false;
      state.message = '';
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
