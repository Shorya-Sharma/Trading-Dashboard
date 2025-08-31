import { store } from '../store/store';
import { showNotification } from '../store/notificationSlice';

export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
};

export function notify(message, type = NotificationType.SUCCESS) {
  store.dispatch(showNotification({ message, type }));
}
