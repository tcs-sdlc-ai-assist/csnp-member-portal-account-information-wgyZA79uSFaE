/**
 * Communication preferences business logic service for the CSNP Member Portal.
 * Provides formatted and validated communication preferences by wrapping
 * repository calls with PII masking for logging and input validation.
 * @module communicationPreferencesService
 */

import {
  getCommunicationPreferences as getPreferencesFromRepo,
  updateCommunicationPreferences as updatePreferencesInRepo,
} from './communicationPreferencesRepository.js';
import { maskObject, safeLog } from '../utils/piiMasker.js';
import { NOTIFICATION_METHODS } from '../utils/constants.js';

/**
 * Validates the delivery email format.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email format is valid.
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates notification methods against the allowed list.
 *
 * @param {string[]} methods - The notification methods to validate.
 * @returns {boolean} True if all methods are valid.
 */
function areValidMethods(methods) {
  if (!Array.isArray(methods)) {
    return false;
  }
  return methods.every((method) => NOTIFICATION_METHODS.includes(method));
}

/**
 * Validates category preferences structure and content.
 *
 * @param {Array<Object>} categoryPreferences - The category preferences to validate.
 * @returns {{ valid: boolean, error?: string }} Validation result.
 */
function validateCategoryPreferences(categoryPreferences) {
  if (!Array.isArray(categoryPreferences)) {
    return { valid: false, error: 'Category preferences must be an array' };
  }

  for (const pref of categoryPreferences) {
    if (!pref || typeof pref !== 'object') {
      return { valid: false, error: 'Each category preference must be an object' };
    }

    if (!pref.category || typeof pref.category !== 'string') {
      return { valid: false, error: 'Each category preference must have a category name' };
    }

    if (pref.methods !== undefined && !areValidMethods(pref.methods)) {
      return {
        valid: false,
        error: `Invalid notification method found in category "${pref.category}". Valid methods are: ${NOTIFICATION_METHODS.join(', ')}`,
      };
    }

    if (pref.enabled !== undefined && typeof pref.enabled !== 'boolean') {
      return { valid: false, error: `The "enabled" field in category "${pref.category}" must be a boolean` };
    }
  }

  return { valid: true };
}

/**
 * Validates the full set of communication preference fields before update.
 *
 * @param {Object} data - The preference data to validate.
 * @returns {{ valid: boolean, error?: string }} Validation result.
 */
function validatePreferenceData(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Preference data must be an object' };
  }

  if (data.deliveryEmail !== undefined && !isValidEmail(data.deliveryEmail)) {
    return { valid: false, error: 'Invalid email format for delivery email' };
  }

  if (data.paperless !== undefined && typeof data.paperless !== 'boolean') {
    return { valid: false, error: 'Paperless setting must be a boolean' };
  }

  if (data.preferredLanguage !== undefined && typeof data.preferredLanguage !== 'string') {
    return { valid: false, error: 'Preferred language must be a string' };
  }

  if (data.categoryPreferences !== undefined) {
    const catResult = validateCategoryPreferences(data.categoryPreferences);
    if (!catResult.valid) {
      return catResult;
    }
  }

  if (data.doNotCallHours !== undefined) {
    if (typeof data.doNotCallHours !== 'object' || data.doNotCallHours === null) {
      return { valid: false, error: 'Do-not-call hours must be an object' };
    }
    if (data.doNotCallHours.start !== undefined && typeof data.doNotCallHours.start !== 'string') {
      return { valid: false, error: 'Do-not-call start time must be a string' };
    }
    if (data.doNotCallHours.end !== undefined && typeof data.doNotCallHours.end !== 'string') {
      return { valid: false, error: 'Do-not-call end time must be a string' };
    }
  }

  return { valid: true };
}

/**
 * Retrieves the member's communication preferences from the repository.
 * Logs the access with PII masking applied.
 *
 * @returns {Object} The member's communication preferences.
 * @property {boolean} paperless - Whether paperless delivery is enabled.
 * @property {string} deliveryEmail - The email address for delivery.
 * @property {Array<Object>} categoryPreferences - List of notification category preferences.
 * @property {string} preferredLanguage - The member's preferred language.
 * @property {Object} doNotCallHours - The do-not-call time window.
 *
 * @example
 * const prefs = getPreferences();
 * // { paperless: true, deliveryEmail: 'jane.doe@fakeemail.com', ... }
 */
export function getPreferences() {
  try {
    const data = getPreferencesFromRepo();
    safeLog('CommunicationPreferencesService', { message: 'Retrieved communication preferences', ...data });
    return data;
  } catch (_err) {
    safeLog('CommunicationPreferencesService', { message: 'Failed to retrieve communication preferences' });
    return {};
  }
}

/**
 * Retrieves the member's communication preferences with all PII fields masked.
 * Useful for display in logs, debug views, or non-privileged contexts.
 *
 * @returns {Object} The member's communication preferences with PII fields masked.
 *
 * @example
 * const masked = getMaskedPreferences();
 * // { paperless: true, deliveryEmail: 'j***@fakeemail.com', ... }
 */
export function getMaskedPreferences() {
  try {
    const data = getPreferencesFromRepo();
    const masked = maskObject(data);
    safeLog('CommunicationPreferencesService', { message: 'Retrieved masked communication preferences' });
    return masked;
  } catch (_err) {
    safeLog('CommunicationPreferencesService', { message: 'Failed to retrieve masked communication preferences' });
    return {};
  }
}

/**
 * Updates the member's communication preferences after validation.
 * Validates preference data (e.g., valid notification methods, email format),
 * applies PII masking for logging, and returns formatted results.
 *
 * @param {Object} data - Partial communication preferences to update.
 * @param {boolean} [data.paperless] - Whether paperless delivery is enabled.
 * @param {string} [data.deliveryEmail] - The email address for delivery.
 * @param {Array<Object>} [data.categoryPreferences] - List of notification category preferences.
 * @param {string} [data.preferredLanguage] - The member's preferred language.
 * @param {Object} [data.doNotCallHours] - The do-not-call time window.
 * @returns {{ success: boolean, communicationPreferences?: Object, error?: string }} The result of the update.
 *
 * @example
 * const result = updatePreferences({ paperless: false });
 * // { success: true, communicationPreferences: { ... } }
 *
 * @example
 * const result = updatePreferences({ deliveryEmail: 'invalid' });
 * // { success: false, error: 'Invalid email format for delivery email' }
 */
export function updatePreferences(data) {
  try {
    const validation = validatePreferenceData(data);

    if (!validation.valid) {
      safeLog('CommunicationPreferencesService', { message: 'Validation failed', error: validation.error });
      return { success: false, error: validation.error };
    }

    const result = updatePreferencesInRepo(data);

    if (result.success) {
      safeLog('CommunicationPreferencesService', {
        message: 'Updated communication preferences',
        fields: Object.keys(data),
      });
    } else {
      safeLog('CommunicationPreferencesService', { message: 'Failed to update communication preferences' });
    }

    return result;
  } catch (_err) {
    safeLog('CommunicationPreferencesService', { message: 'Failed to update communication preferences due to unexpected error' });
    return { success: false, error: 'An unexpected error occurred while updating communication preferences' };
  }
}