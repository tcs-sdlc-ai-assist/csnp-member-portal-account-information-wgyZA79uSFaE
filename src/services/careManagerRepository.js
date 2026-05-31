/**
 * Specialized care manager data repository for the CSNP Member Portal.
 * Provides read-only access to care manager information backed by localStorage
 * via storageHelper, initializing from mockData defaults when no persisted data exists.
 * @module careManagerRepository
 */

import { getItem, setItem } from '../utils/storageHelper.js';
import { safeLog } from '../utils/piiMasker.js';
import { STORAGE_KEYS } from '../utils/constants.js';
import { defaultCareManagerInfo } from '../data/mockData.js';

/**
 * Retrieves the member's care manager information from storage.
 * If no data exists in storage, initializes with default mock data.
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
  let data = getItem(STORAGE_KEYS.careManagerInfo);

  if (!data) {
    data = { ...defaultCareManagerInfo };
    setItem(STORAGE_KEYS.careManagerInfo, data);
    safeLog('CareManagerRepository', { message: 'Initialized care manager info from defaults' });
  }

  return data;
}