/**
 * Storage abstraction utility for the CSNP Member Portal.
 * Provides localStorage access with graceful fallback to in-memory storage.
 * @module storageHelper
 */

import { safeLog } from './piiMasker.js';

/**
 * In-memory fallback store used when localStorage is unavailable.
 * @type {Map<string, string>}
 */
const memoryStore = new Map();

/**
 * Whether localStorage is available in the current environment.
 * @type {boolean}
 */
let localStorageAvailable = false;

/**
 * Detects whether localStorage is accessible and functional.
 * Some browsers throw in incognito mode or when storage is full.
 * @returns {boolean} True if localStorage is available.
 */
function detectLocalStorage() {
  try {
    const testKey = '__csnp_storage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (_err) {
    return false;
  }
}

localStorageAvailable = detectLocalStorage();

if (!localStorageAvailable) {
  safeLog('StorageHelper', { message: 'localStorage unavailable, using in-memory fallback' });
}

/**
 * Retrieves a value from storage by key.
 * Automatically parses JSON values. Returns null if the key does not exist
 * or if parsing fails.
 *
 * @param {string} key - The storage key to retrieve.
 * @returns {*} The parsed value, or null if not found or on error.
 *
 * @example
 * const info = getItem('csnp_personal_info');
 */
export function getItem(key) {
  try {
    let raw;
    if (localStorageAvailable) {
      raw = window.localStorage.getItem(key);
    } else {
      raw = memoryStore.has(key) ? memoryStore.get(key) : null;
    }

    if (raw === null || raw === undefined) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (_parseErr) {
      return raw;
    }
  } catch (_err) {
    safeLog('StorageHelper getItem error', { key });
    return null;
  }
}

/**
 * Stores a value in storage under the given key.
 * Values are serialized to JSON before storage.
 *
 * @param {string} key - The storage key.
 * @param {*} value - The value to store (will be JSON-serialized).
 * @returns {boolean} True if the operation succeeded, false otherwise.
 *
 * @example
 * setItem('csnp_personal_info', { name: 'Jane Doe' });
 */
export function setItem(key, value) {
  try {
    const serialized = JSON.stringify(value);

    if (localStorageAvailable) {
      window.localStorage.setItem(key, serialized);
    } else {
      memoryStore.set(key, serialized);
    }

    return true;
  } catch (_err) {
    safeLog('StorageHelper setItem error', { key });
    return false;
  }
}

/**
 * Removes a value from storage by key.
 *
 * @param {string} key - The storage key to remove.
 * @returns {boolean} True if the operation succeeded, false otherwise.
 *
 * @example
 * removeItem('csnp_personal_info');
 */
export function removeItem(key) {
  try {
    if (localStorageAvailable) {
      window.localStorage.removeItem(key);
    } else {
      memoryStore.delete(key);
    }

    return true;
  } catch (_err) {
    safeLog('StorageHelper removeItem error', { key });
    return false;
  }
}

/**
 * Clears all values from storage.
 *
 * @returns {boolean} True if the operation succeeded, false otherwise.
 *
 * @example
 * clear();
 */
export function clear() {
  try {
    if (localStorageAvailable) {
      window.localStorage.clear();
    } else {
      memoryStore.clear();
    }

    return true;
  } catch (_err) {
    safeLog('StorageHelper clear error', { message: 'Failed to clear storage' });
    return false;
  }
}