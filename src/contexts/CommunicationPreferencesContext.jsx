import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getPreferences, getMaskedPreferences, updatePreferences } from '../services/communicationPreferencesService.js';
import { SIMULATION_HINT_TEXT } from '../utils/constants.js';

/**
 * @typedef {Object} CommunicationPreferencesContextValue
 * @property {Object} preferences - The communication preferences data.
 * @property {Object} maskedPreferences - The communication preferences with PII fields masked.
 * @property {boolean} loading - Whether the preferences data is currently loading.
 * @property {string|null} error - The most recent error message, or null.
 * @property {string} simulationHint - Hint text for simulation mode.
 * @property {function} updateCommunicationPreferences - Updates communication preferences with the provided data.
 * @property {function} refresh - Reloads communication preferences from the service.
 */

const CommunicationPreferencesContext = createContext(null);

/**
 * Communication preferences context provider component.
 * Wraps communicationPreferencesService to provide preferences data,
 * masked preferences, and update functions to all child components.
 * Loads data on mount.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap.
 * @returns {React.ReactElement} The CommunicationPreferencesProvider component.
 */
export function CommunicationPreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState({});
  const [maskedPreferences, setMaskedPreferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Loads communication preferences data from the service layer.
   */
  const loadPreferences = useCallback(() => {
    try {
      setLoading(true);
      setError(null);

      const prefs = getPreferences();
      const masked = getMaskedPreferences();

      setPreferences(prefs);
      setMaskedPreferences(masked);
    } catch (_err) {
      setError('Failed to load communication preferences');
      setPreferences({});
      setMaskedPreferences({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  /**
   * Updates communication preferences with the provided data.
   * Validates and persists changes via the service layer, then refreshes state.
   *
   * @param {Object} data - Partial communication preferences to update.
   * @param {boolean} [data.paperless] - Whether paperless delivery is enabled.
   * @param {string} [data.deliveryEmail] - The email address for delivery.
   * @param {Array<Object>} [data.categoryPreferences] - List of notification category preferences.
   * @param {string} [data.preferredLanguage] - The member's preferred language.
   * @param {Object} [data.doNotCallHours] - The do-not-call time window.
   * @returns {{ success: boolean, communicationPreferences?: Object, error?: string }} The result of the update.
   */
  const updateCommunicationPreferences = useCallback((data) => {
    try {
      setError(null);

      const result = updatePreferences(data);

      if (result.success) {
        const updatedPrefs = getPreferences();
        const updatedMasked = getMaskedPreferences();

        setPreferences(updatedPrefs);
        setMaskedPreferences(updatedMasked);

        return { success: true, communicationPreferences: updatedPrefs };
      }

      const errorMessage = result.error || 'Failed to update communication preferences';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (_err) {
      const errorMessage = 'An unexpected error occurred while updating communication preferences';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const value = useMemo(() => ({
    preferences,
    maskedPreferences,
    loading,
    error,
    simulationHint: SIMULATION_HINT_TEXT.communicationPreferences,
    updateCommunicationPreferences,
    refresh: loadPreferences,
  }), [preferences, maskedPreferences, loading, error, updateCommunicationPreferences, loadPreferences]);

  return (
    <CommunicationPreferencesContext.Provider value={value}>
      {children}
    </CommunicationPreferencesContext.Provider>
  );
}

CommunicationPreferencesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access the communication preferences context.
 * Must be used within a CommunicationPreferencesProvider.
 *
 * @returns {CommunicationPreferencesContextValue} The communication preferences context value.
 *
 * @example
 * const { preferences, updateCommunicationPreferences, loading, error } = useCommunicationPreferences();
 */
export function useCommunicationPreferences() {
  const context = useContext(CommunicationPreferencesContext);

  if (context === null) {
    throw new Error('useCommunicationPreferences must be used within a CommunicationPreferencesProvider');
  }

  return context;
}

export default CommunicationPreferencesContext;