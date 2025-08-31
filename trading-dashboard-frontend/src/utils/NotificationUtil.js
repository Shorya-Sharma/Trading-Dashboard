import { store } from '../store/store';
import { showNotification } from '../store/notificationSlice';

export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
};

/**
 * notify function.
 * - Dispatches a global notification using Redux
 * - Accepts a message and optional type (success by default)
 */
export function notify(message, type = NotificationType.SUCCESS) {
  store.dispatch(showNotification({ message, type }));
}
