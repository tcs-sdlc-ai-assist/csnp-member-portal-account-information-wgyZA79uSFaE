import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getCareManagerInfo, getFormattedCareManagerInfo, getMaskedCareManagerInfo } from '../services/careManagerService.js';
import { SIMULATION_HINT_TEXT } from '../utils/constants.js';

/**
 * @typedef {Object} CareManagerContextValue
 * @property {Object} careManagerInfo - The care manager information.
 * @property {Object} formattedCareManagerInfo - The care manager info with formatted dates.
 * @property {Object} maskedCareManagerInfo - The care manager info with PII fields masked.
 * @property {boolean} loading - Whether the care manager data is currently loading.
 * @property {string|null} error - The most recent error message, or null.
 * @property {string} simulationHint - Hint text for simulation mode.
 * @property {function} refresh - Reloads care manager data from the service.
 */

const CareManagerContext = createContext(null);

/**
 * Care manager context provider component.
 * Wraps careManagerService to provide care manager info, formatted info,
 * and masked info to all child components. Loads data on mount.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap.
 * @returns {React.ReactElement} The CareManagerProvider component.
 */
export function CareManagerProvider({ children }) {
  const [careManagerInfo, setCareManagerInfo] = useState({});
  const [formattedCareManagerInfo, setFormattedCareManagerInfo] = useState({});
  const [maskedCareManagerInfo, setMaskedCareManagerInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Loads care manager data from the service layer.
   */
  const loadCareManagerData = () => {
    try {
      setLoading(true);
      setError(null);

      const info = getCareManagerInfo();
      const formatted = getFormattedCareManagerInfo();
      const masked = getMaskedCareManagerInfo();

      setCareManagerInfo(info);
      setFormattedCareManagerInfo(formatted);
      setMaskedCareManagerInfo(masked);
    } catch (_err) {
      setError('Failed to load care manager information');
      setCareManagerInfo({});
      setFormattedCareManagerInfo({});
      setMaskedCareManagerInfo({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCareManagerData();
  }, []);

  const value = useMemo(() => ({
    careManagerInfo,
    formattedCareManagerInfo,
    maskedCareManagerInfo,
    loading,
    error,
    simulationHint: SIMULATION_HINT_TEXT.careManager,
    refresh: loadCareManagerData,
  }), [careManagerInfo, formattedCareManagerInfo, maskedCareManagerInfo, loading, error]);

  return (
    <CareManagerContext.Provider value={value}>
      {children}
    </CareManagerContext.Provider>
  );
}

CareManagerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access the care manager context.
 * Must be used within a CareManagerProvider.
 *
 * @returns {CareManagerContextValue} The care manager context value.
 *
 * @example
 * const { careManagerInfo, formattedCareManagerInfo, loading, error } = useCareManagerInfo();
 */
export function useCareManagerInfo() {
  const context = useContext(CareManagerContext);

  if (context === null) {
    throw new Error('useCareManagerInfo must be used within a CareManagerProvider');
  }

  return context;
}

export default CareManagerContext;