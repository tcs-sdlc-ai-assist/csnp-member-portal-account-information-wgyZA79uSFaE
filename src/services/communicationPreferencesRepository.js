/**
 * Specialized communication preferences data repository for the CSNP Member Portal.
 * Provides read and update access to communication preferences backed by localStorage
 * via storageHelper, initializing from mockData defaults when no persisted data exists.
 * @module communicationPreferencesRepository
 */

import { getItem, setItem } from '../utils/storageHelper.js';
import { safeLog } from '../utils/piiMasker.js';
import { STORAGE_KEYS } from '../utils/constants.js';
import { defaultCommunicationPreferences } from '../data/mockData.js';

/**
 * Retrieves the member's communication preferences from storage.
 * If no data exists in storage, initializes with default mock data.
 *
 * @returns {Object} The member's communication preferences.
 * @property {boolean} paperless - Whether paperless delivery is enabled.
 * @property {string} deliveryEmail - The email address for delivery.
 * @property {Array<Object>} categoryPreferences - List of notification category preferences.
 * @property {string} preferredLanguage - The member's preferred language.
 * @property {Object} doNotCallHours - The do-not-call time window.
 * @property {string} doNotCallHours.start - Start time of do-not-call window (HH:mm).
 * @property {string} doNotCallHours.end - End time of do-not-call window (HH:mm).
 *
 * @example
 * const prefs = getCommunicationPreferences();
 * // { paperless: true, deliveryEmail: 'jane.doe@fakeemail.com', ... }
 */
export function getCommunicationPreferences() {
  let data = getItem(STORAGE_KEYS.communicationPreferences);

  if (!data) {
    data = { ...defaultCommunicationPreferences };
    setItem(STORAGE_KEYS.communicationPreferences, data);
    safeLog('CommunicationPreferencesRepository', { message: 'Initialized communication preferences from defaults' });
  }

  return data;
}

/**
 * Updates the member's communication preferences in storage.
 * Merges the provided fields with the existing preferences.
 *
 * @param {Object} updatedFields - Partial communication preferences to update.
 * @returns {{ success: boolean, communicationPreferences?: Object, error?: string }} The result of the update.
 *
 * @example
 * const result = updateCommunicationPreferences({ paperless: false });
 * // { success: true, communicationPreferences: { ... } }
 */
export function updateCommunicationPreferences(updatedFields) {
  try {
    const current = getCommunicationPreferences();
    const updated = { ...current, ...updatedFields };
    setItem(STORAGE_KEYS.communicationPreferences, updated);
    safeLog('CommunicationPreferencesRepository', { message: 'Updated communication preferences', fields: Object.keys(updatedFields) });
    return { success: true, communicationPreferences: updated };
  } catch (_err) {
    safeLog('CommunicationPreferencesRepository', { message: 'Failed to update communication preferences' });
    return { success: false, error: 'Failed to update communication preferences' };
  }
}