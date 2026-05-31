/**
 * Care manager business logic service for the CSNP Member Portal.
 * Provides formatted and masked care manager information by wrapping
 * repository calls with PII masking for logging.
 * @module careManagerService
 */

import { getCareManagerInfo as getCareManagerInfoFromRepo } from './careManagerRepository.js';
import { maskObject, safeLog } from '../utils/piiMasker.js';
import { formatDate } from '../utils/dateReference.js';

/**
 * Retrieves the member's care manager information from the repository.
 * Logs the access with PII masking applied.
 *
 * @returns {Object} The member's care manager information.
 * @property {string} name - The care manager's name.
 * @property {string} phone - The care manager's phone number.
 * @property {string} email - The care manager's email address.
 * @property {string} assignedDate - The date the care manager was assigned (YYYY-MM-DD).
 * @property {string} department - The care manager's department.
 * @property {string} availability - The care manager's availability hours.
 * @property {string} nextScheduledCall - The next scheduled call date (YYYY-MM-DD).
 *
 * @example
 * const cmInfo = getCareManagerInfo();
 * // { name: 'Sarah Williams, RN', phone: '(555) 321-9876', ... }
 */
export function getCareManagerInfo() {
  try {
    const data = getCareManagerInfoFromRepo();
    safeLog('CareManagerService', { message: 'Retrieved care manager info', ...data });
    return data;
  } catch (_err) {
    safeLog('CareManagerService', { message: 'Failed to retrieve care manager info' });
    return {};
  }
}

/**
 * Retrieves the member's care manager information with all PII fields masked.
 * Useful for display in logs, debug views, or non-privileged contexts.
 *
 * @returns {Object} The member's care manager information with PII fields masked.
 *
 * @example
 * const masked = getMaskedCareManagerInfo();
 * // { name: 'S***** W*******, RN', phone: '(***) ***-9876', ... }
 */
export function getMaskedCareManagerInfo() {
  try {
    const data = getCareManagerInfoFromRepo();
    const masked = maskObject(data);
    safeLog('CareManagerService', { message: 'Retrieved masked care manager info' });
    return masked;
  } catch (_err) {
    safeLog('CareManagerService', { message: 'Failed to retrieve masked care manager info' });
    return {};
  }
}

/**
 * Retrieves the member's care manager information with dates formatted
 * for display purposes.
 *
 * @param {string} [dateFormat='MMMM D, YYYY'] - The format string for dates.
 * @returns {Object} The member's care manager information with formatted dates.
 *
 * @example
 * const formatted = getFormattedCareManagerInfo();
 * // { name: 'Sarah Williams, RN', assignedDate: 'March 12, 2024', ... }
 */
export function getFormattedCareManagerInfo(dateFormat = 'MMMM D, YYYY') {
  try {
    const data = getCareManagerInfoFromRepo();
    const formatted = { ...data };

    if (formatted.assignedDate) {
      const parts = formatted.assignedDate.split('-');
      if (parts.length === 3) {
        const date = new Date(
          parseInt(parts[0], 10),
          parseInt(parts[1], 10) - 1,
          parseInt(parts[2], 10)
        );
        formatted.assignedDateFormatted = formatDate(date, dateFormat);
      }
    }

    if (formatted.nextScheduledCall) {
      const parts = formatted.nextScheduledCall.split('-');
      if (parts.length === 3) {
        const date = new Date(
          parseInt(parts[0], 10),
          parseInt(parts[1], 10) - 1,
          parseInt(parts[2], 10)
        );
        formatted.nextScheduledCallFormatted = formatDate(date, dateFormat);
      }
    }

    safeLog('CareManagerService', { message: 'Retrieved formatted care manager info' });
    return formatted;
  } catch (_err) {
    safeLog('CareManagerService', { message: 'Failed to retrieve formatted care manager info' });
    return {};
  }
}