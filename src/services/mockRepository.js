/**
 * Central mock repository for all domain data in the CSNP Member Portal.
 * Provides CRUD operations backed by localStorage via storageHelper,
 * initializing from mockData defaults when no persisted data exists.
 * @module mockRepository
 */

import { getItem, setItem } from '../utils/storageHelper.js';
import { safeLog } from '../utils/piiMasker.js';
import { STORAGE_KEYS } from '../utils/constants.js';
import { formatDate, getRelativeDate } from '../utils/dateReference.js';
import {
  defaultPersonalInfo,
  defaultRepresentatives,
  defaultPrivacySettings,
  defaultCommunicationPreferences,
  defaultPCPInfo,
  defaultCareManagerInfo,
} from '../data/mockData.js';

/**
 * Retrieves the member's personal information from storage.
 * If no data exists in storage, initializes with default mock data.
 *
 * @returns {Object} The member's personal information.
 *
 * @example
 * const info = getPersonalInfo();
 * // { firstName: 'Jane', lastName: 'Doe', ... }
 */
export function getPersonalInfo() {
  let data = getItem(STORAGE_KEYS.personalInfo);

  if (!data) {
    data = { ...defaultPersonalInfo };
    setItem(STORAGE_KEYS.personalInfo, data);
    safeLog('MockRepository', { message: 'Initialized personal info from defaults' });
  }

  return data;
}

/**
 * Updates the member's personal information in storage.
 * Merges the provided fields with the existing data.
 *
 * @param {Object} updatedFields - Partial personal info fields to update.
 * @returns {{ success: boolean, personalInfo: Object }} The result of the update.
 *
 * @example
 * const result = updatePersonalInfo({ email: 'new@fakeemail.com' });
 * // { success: true, personalInfo: { ... } }
 */
export function updatePersonalInfo(updatedFields) {
  try {
    const current = getPersonalInfo();
    const updated = { ...current, ...updatedFields };
    setItem(STORAGE_KEYS.personalInfo, updated);
    safeLog('MockRepository', { message: 'Updated personal info', fields: Object.keys(updatedFields) });
    return { success: true, personalInfo: updated };
  } catch (_err) {
    safeLog('MockRepository', { message: 'Failed to update personal info' });
    return { success: false, error: 'Failed to update personal information' };
  }
}

/**
 * Retrieves the list of authorized representatives from storage.
 * If no data exists in storage, initializes with default mock data.
 *
 * @returns {Array<Object>} The list of authorized representatives.
 *
 * @example
 * const reps = getRepresentatives();
 * // [{ id: 'rep-001', name: 'John Doe', ... }, ...]
 */
export function getRepresentatives() {
  let data = getItem(STORAGE_KEYS.representatives);

  if (!data) {
    data = defaultRepresentatives.map((rep) => ({ ...rep }));
    setItem(STORAGE_KEYS.representatives, data);
    safeLog('MockRepository', { message: 'Initialized representatives from defaults' });
  }

  return data;
}

/**
 * Adds a new authorized representative to storage.
 *
 * @param {Object} rep - The representative to add.
 * @param {string} rep.name - The representative's name.
 * @param {string} rep.relationship - The relationship to the member.
 * @param {string} rep.phone - The representative's phone number.
 * @param {string} [rep.email] - The representative's email address.
 * @param {string[]} [rep.permissions] - List of granted permissions.
 * @returns {{ success: boolean, representative?: Object, representatives?: Array<Object>, error?: string }} The result.
 *
 * @example
 * const result = addRepresentative({ name: 'Bob Smith', relationship: 'Son', phone: '(555) 111-2222' });
 */
export function addRepresentative(rep) {
  try {
    if (!rep || !rep.name || !rep.relationship) {
      return { success: false, error: 'Name and relationship are required' };
    }

    const representatives = getRepresentatives();
    const newRep = {
      ...rep,
      id: rep.id || 'rep-' + Date.now().toString(36),
      authorizedDate: rep.authorizedDate || formatDate(getRelativeDate(0), 'YYYY-MM-DD'),
      permissions: rep.permissions || [],
    };

    representatives.push(newRep);
    setItem(STORAGE_KEYS.representatives, representatives);
    safeLog('MockRepository', { message: 'Added representative', id: newRep.id });
    return { success: true, representative: newRep, representatives };
  } catch (_err) {
    safeLog('MockRepository', { message: 'Failed to add representative' });
    return { success: false, error: 'Failed to add representative' };
  }
}

/**
 * Edits an existing authorized representative in storage.
 *
 * @param {string} id - The ID of the representative to edit.
 * @param {Object} updatedFields - The fields to update on the representative.
 * @returns {{ success: boolean, representative?: Object, representatives?: Array<Object>, error?: string }} The result.
 *
 * @example
 * const result = editRepresentative('rep-001', { phone: '(555) 999-8888' });
 */
export function editRepresentative(id, updatedFields) {
  try {
    if (!id) {
      return { success: false, error: 'Representative ID is required' };
    }

    const representatives = getRepresentatives();
    const index = representatives.findIndex((rep) => rep.id === id);

    if (index === -1) {
      return { success: false, error: 'Representative not found' };
    }

    const updated = { ...representatives[index], ...updatedFields, id };
    representatives[index] = updated;
    setItem(STORAGE_KEYS.representatives, representatives);
    safeLog('MockRepository', { message: 'Edited representative', id });
    return { success: true, representative: updated, representatives };
  } catch (_err) {
    safeLog('MockRepository', { message: 'Failed to edit representative' });
    return { success: false, error: 'Failed to edit representative' };
  }
}

/**
 * Removes an authorized representative from storage.
 *
 * @param {string} id - The ID of the representative to remove.
 * @returns {{ success: boolean, representatives?: Array<Object>, error?: string }} The result.
 *
 * @example
 * const result = removeRepresentative('rep-001');
 */
export function removeRepresentative(id) {
  try {
    if (!id) {
      return { success: false, error: 'Representative ID is required' };
    }

    const representatives = getRepresentatives();
    const index = representatives.findIndex((rep) => rep.id === id);

    if (index === -1) {
      return { success: false, error: 'Representative not found' };
    }

    representatives.splice(index, 1);
    setItem(STORAGE_KEYS.representatives, representatives);
    safeLog('MockRepository', { message: 'Removed representative', id });
    return { success: true, representatives };
  } catch (_err) {
    safeLog('MockRepository', { message: 'Failed to remove representative' });
    return { success: false, error: 'Failed to remove representative' };
  }
}

/**
 * Retrieves the member's privacy settings from storage.
 * If no data exists in storage, initializes with default mock data.
 *
 * @returns {Object} The member's privacy settings.
 *
 * @example
 * const settings = getPrivacySettings();
 * // { twoFactorEnabled: true, ... }
 */
export function getPrivacySettings() {
  let data = getItem(STORAGE_KEYS.privacySettings);

  if (!data) {
    data = { ...defaultPrivacySettings };
    setItem(STORAGE_KEYS.privacySettings, data);
    safeLog('MockRepository', { message: 'Initialized privacy settings from defaults' });
  }

  return data;
}

/**
 * Updates the member's privacy settings in storage.
 * Merges the provided fields with the existing settings.
 *
 * @param {Object} updatedFields - Partial privacy settings to update.
 * @returns {{ success: boolean, privacySettings?: Object, error?: string }} The result.
 *
 * @example
 * const result = updatePrivacySettings({ twoFactorEnabled: false });
 */
export function updatePrivacySettings(updatedFields) {
  try {
    const current = getPrivacySettings();
    const updated = { ...current, ...updatedFields };
    setItem(STORAGE_KEYS.privacySettings, updated);
    safeLog('MockRepository', { message: 'Updated privacy settings', fields: Object.keys(updatedFields) });
    return { success: true, privacySettings: updated };
  } catch (_err) {
    safeLog('MockRepository', { message: 'Failed to update privacy settings' });
    return { success: false, error: 'Failed to update privacy settings' };
  }
}

/**
 * Retrieves the member's communication preferences from storage.
 * If no data exists in storage, initializes with default mock data.
 *
 * @returns {Object} The member's communication preferences.
 *
 * @example
 * const prefs = getCommunicationPreferences();
 * // { paperless: true, categoryPreferences: [...], ... }
 */
export function getCommunicationPreferences() {
  let data = getItem(STORAGE_KEYS.communicationPreferences);

  if (!data) {
    data = { ...defaultCommunicationPreferences };
    setItem(STORAGE_KEYS.communicationPreferences, data);
    safeLog('MockRepository', { message: 'Initialized communication preferences from defaults' });
  }

  return data;
}

/**
 * Updates the member's communication preferences in storage.
 * Merges the provided fields with the existing preferences.
 *
 * @param {Object} updatedFields - Partial communication preferences to update.
 * @returns {{ success: boolean, communicationPreferences?: Object, error?: string }} The result.
 *
 * @example
 * const result = updateCommunicationPreferences({ paperless: false });
 */
export function updateCommunicationPreferences(updatedFields) {
  try {
    const current = getCommunicationPreferences();
    const updated = { ...current, ...updatedFields };
    setItem(STORAGE_KEYS.communicationPreferences, updated);
    safeLog('MockRepository', { message: 'Updated communication preferences', fields: Object.keys(updatedFields) });
    return { success: true, communicationPreferences: updated };
  } catch (_err) {
    safeLog('MockRepository', { message: 'Failed to update communication preferences' });
    return { success: false, error: 'Failed to update communication preferences' };
  }
}

/**
 * Retrieves the member's PCP (Primary Care Provider) information from storage.
 * If no data exists in storage, initializes with default mock data.
 *
 * @returns {Object} The member's PCP information.
 *
 * @example
 * const pcp = getPCPInfo();
 * // { name: 'Dr. Robert Chen', specialty: 'Internal Medicine', ... }
 */
export function getPCPInfo() {
  let data = getItem(STORAGE_KEYS.pcpInfo);

  if (!data) {
    data = { ...defaultPCPInfo };
    setItem(STORAGE_KEYS.pcpInfo, data);
    safeLog('MockRepository', { message: 'Initialized PCP info from defaults' });
  }

  return data;
}

/**
 * Submits a simulated PCP change request.
 * Updates the stored PCP information with the new provider.
 *
 * @param {Object} newPCP - The new PCP information.
 * @param {string} newPCP.name - The new PCP's name.
 * @param {string} reason - The reason for the PCP change.
 * @param {string} [details] - Additional details (required if reason is 'Other').
 * @returns {{ success: boolean, confirmationMessage?: string, pcpInfo?: Object, error?: string }} The result.
 *
 * @example
 * const result = changePCP(
 *   { name: 'Dr. Maria Gonzalez', specialty: 'Cardiology', npi: '9876543210' },
 *   'Relocating to a new area',
 *   'Moving to a different city'
 * );
 */
export function changePCP(newPCP, reason, details) {
  try {
    if (!newPCP || !newPCP.name) {
      return { success: false, error: 'New PCP information is required' };
    }

    if (!reason) {
      return { success: false, error: 'A reason for the PCP change is required' };
    }

    if (reason === 'Other' && (!details || details.trim().length === 0)) {
      return { success: false, error: 'Please provide additional details for the PCP change reason' };
    }

    const updatedPCP = {
      ...newPCP,
      effectiveDate: formatDate(getRelativeDate(2), 'YYYY-MM-DD'),
    };

    setItem(STORAGE_KEYS.pcpInfo, updatedPCP);
    safeLog('MockRepository', { message: 'PCP change submitted', reason });

    return {
      success: true,
      confirmationMessage: 'Your PCP change request has been submitted. The change will be effective in approximately 2 business days.',
      pcpInfo: updatedPCP,
    };
  } catch (_err) {
    safeLog('MockRepository', { message: 'Failed to process PCP change' });
    return { success: false, error: 'Failed to process PCP change request' };
  }
}

/**
 * Retrieves the member's care manager information from storage.
 * If no data exists in storage, initializes with default mock data.
 *
 * @returns {Object} The member's care manager information.
 *
 * @example
 * const cm = getCareManagerInfo();
 * // { name: 'Sarah Williams, RN', phone: '(555) 321-9876', ... }
 */
export function getCareManagerInfo() {
  let data = getItem(STORAGE_KEYS.careManagerInfo);

  if (!data) {
    data = { ...defaultCareManagerInfo };
    setItem(STORAGE_KEYS.careManagerInfo, data);
    safeLog('MockRepository', { message: 'Initialized care manager info from defaults' });
  }

  return data;
}