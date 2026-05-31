/**
 * Simulated notification delivery service for the CSNP Member Portal.
 * Provides mock notification sending and history tracking.
 * No real emails, SMS, or other notifications are sent.
 * All notifications are stored in-memory for the current session.
 * @module notificationSimulator
 */

import { formatDate, getRelativeDate } from '../utils/dateReference.js';
import { safeLog, maskObject } from '../utils/piiMasker.js';
import { NOTIFICATION_METHODS } from '../utils/constants.js';

/**
 * In-memory notification history for the current session.
 * @type {Array<Object>}
 */
let notificationHistory = [
  {
    id: 'notif-001',
    type: 'Email',
    recipient: 'jane.doe@fakeemail.com',
    message: 'Your claim CLM-77293 has been processed successfully.',
    status: 'Delivered',
    timestamp: formatDate(getRelativeDate(-5), 'YYYY-MM-DD'),
    category: 'Claims & Billing',
  },
  {
    id: 'notif-002',
    type: 'Text Message (SMS)',
    recipient: '(555) 867-5309',
    message: 'Reminder: Your appointment with Dr. Robert Chen is scheduled for tomorrow at 10:00 AM.',
    status: 'Delivered',
    timestamp: formatDate(getRelativeDate(-3), 'YYYY-MM-DD'),
    category: 'Appointments & Reminders',
  },
  {
    id: 'notif-003',
    type: 'Portal Message',
    recipient: 'jane.doe@fakeemail.com',
    message: 'Your prescription refill for Metformin is ready for pickup at Springfield Community Pharmacy.',
    status: 'Delivered',
    timestamp: formatDate(getRelativeDate(-1), 'YYYY-MM-DD'),
    category: 'Pharmacy & Prescriptions',
  },
  {
    id: 'notif-004',
    type: 'Email',
    recipient: 'jane.doe@fakeemail.com',
    message: 'Your prior authorization request REF-44821 has been approved.',
    status: 'Delivered',
    timestamp: formatDate(getRelativeDate(-2), 'YYYY-MM-DD'),
    category: 'Authorization Status',
  },
  {
    id: 'notif-005',
    type: 'Mail',
    recipient: '742 Evergreen Terrace, Springfield, IL 62704',
    message: 'Your updated Explanation of Benefits (EOB) statement is enclosed.',
    status: 'Delivered',
    timestamp: formatDate(getRelativeDate(-10), 'YYYY-MM-DD'),
    category: 'Claims & Billing',
  },
];

/**
 * Validates the notification type against allowed delivery methods.
 *
 * @param {string} type - The notification delivery method type.
 * @returns {boolean} True if the type is a valid notification method.
 */
function isValidNotificationType(type) {
  if (!type || typeof type !== 'string') {
    return false;
  }
  return NOTIFICATION_METHODS.includes(type);
}

/**
 * Generates a unique notification ID.
 *
 * @returns {string} A unique notification ID string.
 */
function generateNotificationId() {
  return 'notif-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 7);
}

/**
 * Simulates sending a notification to a recipient.
 * No real emails, SMS, or other notifications are sent.
 * The notification is recorded in the in-memory history.
 *
 * @param {string} type - The delivery method type (e.g., 'Email', 'Text Message (SMS)', 'Portal Message', 'Mail', 'Phone Call').
 * @param {string} recipient - The recipient identifier (email address, phone number, address, etc.).
 * @param {string} message - The notification message content.
 * @returns {{ success: boolean, notification?: Object, error?: string }} The simulated notification result.
 *
 * @example
 * const result = simulateNotification('Email', 'jane.doe@fakeemail.com', 'Your claim has been processed.');
 * // { success: true, notification: { id: 'notif-...', type: 'Email', recipient: 'jane.doe@fakeemail.com', ... } }
 *
 * @example
 * const result = simulateNotification('Fax', 'jane.doe@fakeemail.com', 'Test');
 * // { success: false, error: 'Invalid notification type...' }
 */
export function simulateNotification(type, recipient, message) {
  try {
    if (!isValidNotificationType(type)) {
      safeLog('NotificationSimulator', {
        message: 'Invalid notification type',
        type,
        validTypes: NOTIFICATION_METHODS,
      });
      return {
        success: false,
        error: `Invalid notification type "${type}". Valid types are: ${NOTIFICATION_METHODS.join(', ')}`,
      };
    }

    if (!recipient || typeof recipient !== 'string' || recipient.trim().length === 0) {
      safeLog('NotificationSimulator', { message: 'Recipient is required' });
      return { success: false, error: 'Recipient is required' };
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      safeLog('NotificationSimulator', { message: 'Message content is required' });
      return { success: false, error: 'Message content is required' };
    }

    const notification = {
      id: generateNotificationId(),
      type,
      recipient: recipient.trim(),
      message: message.trim(),
      status: 'Delivered',
      timestamp: formatDate(getRelativeDate(0), 'YYYY-MM-DD'),
      category: 'General',
    };

    notificationHistory.push(notification);

    safeLog('NotificationSimulator', {
      message: 'Notification simulated successfully',
      id: notification.id,
      type: notification.type,
      recipient: notification.recipient,
      status: notification.status,
    });

    return { success: true, notification };
  } catch (_err) {
    safeLog('NotificationSimulator', { message: 'Failed to simulate notification' });
    return { success: false, error: 'An unexpected error occurred while simulating the notification' };
  }
}

/**
 * Retrieves the list of simulated past notifications.
 * Returns a copy of the in-memory notification history, sorted by timestamp descending.
 * PII is masked in log output but not in the returned data.
 *
 * @returns {Array<Object>} The list of simulated notifications.
 * @property {string} id - The unique notification ID.
 * @property {string} type - The delivery method type.
 * @property {string} recipient - The recipient identifier.
 * @property {string} message - The notification message content.
 * @property {string} status - The delivery status (e.g., 'Delivered').
 * @property {string} timestamp - The notification timestamp (YYYY-MM-DD).
 * @property {string} category - The notification category.
 *
 * @example
 * const history = getNotificationHistory();
 * // [{ id: 'notif-001', type: 'Email', recipient: 'jane.doe@fakeemail.com', ... }, ...]
 */
export function getNotificationHistory() {
  try {
    const historyCopy = notificationHistory.map((notif) => ({ ...notif }));

    historyCopy.sort((a, b) => {
      if (a.timestamp > b.timestamp) return -1;
      if (a.timestamp < b.timestamp) return 1;
      return 0;
    });

    safeLog('NotificationSimulator', {
      message: 'Retrieved notification history',
      count: historyCopy.length,
    });

    return historyCopy;
  } catch (_err) {
    safeLog('NotificationSimulator', { message: 'Failed to retrieve notification history' });
    return [];
  }
}

/**
 * Retrieves the notification history with all PII fields masked.
 * Useful for display in logs, debug views, or non-privileged contexts.
 *
 * @returns {Array<Object>} The list of simulated notifications with PII fields masked.
 *
 * @example
 * const masked = getMaskedNotificationHistory();
 * // [{ id: 'notif-001', type: 'Email', recipient: 'j***@fakeemail.com', ... }, ...]
 */
export function getMaskedNotificationHistory() {
  try {
    const history = getNotificationHistory();
    const masked = maskObject(history);
    safeLog('NotificationSimulator', { message: 'Retrieved masked notification history' });
    return masked;
  } catch (_err) {
    safeLog('NotificationSimulator', { message: 'Failed to retrieve masked notification history' });
    return [];
  }
}

/**
 * Clears the in-memory notification history.
 * Useful for resetting the simulated state.
 *
 * @returns {{ success: boolean }} The result of the clear operation.
 *
 * @example
 * const result = clearNotificationHistory();
 * // { success: true }
 */
export function clearNotificationHistory() {
  try {
    notificationHistory = [];
    safeLog('NotificationSimulator', { message: 'Notification history cleared' });
    return { success: true };
  } catch (_err) {
    safeLog('NotificationSimulator', { message: 'Failed to clear notification history' });
    return { success: false };
  }
}