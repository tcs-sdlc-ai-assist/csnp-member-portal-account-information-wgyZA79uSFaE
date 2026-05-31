import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getSession, login as sessionLogin, signup as sessionSignup, logout as sessionLogout } from '../services/sessionManager.js';
import { SIMULATION_HINT_TEXT } from '../utils/constants.js';

/**
 * @typedef {Object} AuthContextValue
 * @property {boolean} isAuthenticated - Whether the user is currently logged in.
 * @property {Object|null} user - The current user object, or null if not logged in.
 * @property {string|null} loginTimestamp - ISO timestamp of the login, or null.
 * @property {function} login - Authenticates a user with username and password.
 * @property {function} signup - Registers a new user with user data.
 * @property {function} logout - Logs out the current user.
 * @property {string|null} error - The most recent authentication error message, or null.
 * @property {string} simulationHint - Hint text for simulation mode.
 */

const AuthContext = createContext(null);

/**
 * Authentication context provider component.
 * Wraps sessionManager to provide login, signup, logout, and current user state
 * to all child components. Displays simulation hint when user is authenticated.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap.
 * @returns {React.ReactElement} The AuthProvider component.
 */
export function AuthProvider({ children }) {
  const initialSession = getSession();

  const [isAuthenticated, setIsAuthenticated] = useState(initialSession.loggedIn);
  const [user, setUser] = useState(initialSession.user);
  const [loginTimestamp, setLoginTimestamp] = useState(initialSession.loginTimestamp);
  const [error, setError] = useState(null);

  /**
   * Authenticates a user with the given username and password.
   *
   * @param {string} username - The username to authenticate with.
   * @param {string} password - The password to authenticate with.
   * @returns {{ success: boolean, error?: string }} The login result.
   */
  const login = useCallback((username, password) => {
    setError(null);

    const result = sessionLogin(username, password);

    if (result.success && result.session) {
      setIsAuthenticated(true);
      setUser(result.session.user);
      setLoginTimestamp(result.session.loginTimestamp);
      return { success: true };
    }

    const errorMessage = result.error || 'Login failed';
    setError(errorMessage);
    return { success: false, error: errorMessage };
  }, []);

  /**
   * Registers a new user with the provided user data.
   *
   * @param {Object} userData - The user data for registration.
   * @param {string} userData.firstName - The user's first name.
   * @param {string} userData.lastName - The user's last name.
   * @param {string} userData.email - The user's email address.
   * @param {string} [userData.username] - The desired username.
   * @param {string} [userData.password] - The desired password.
   * @returns {{ success: boolean, error?: string }} The signup result.
   */
  const signup = useCallback((userData) => {
    setError(null);

    const result = sessionSignup(userData);

    if (result.success && result.session) {
      setIsAuthenticated(true);
      setUser(result.session.user);
      setLoginTimestamp(result.session.loginTimestamp);
      return { success: true };
    }

    const errorMessage = result.error || 'Signup failed';
    setError(errorMessage);
    return { success: false, error: errorMessage };
  }, []);

  /**
   * Logs out the current user and clears authentication state.
   *
   * @returns {{ success: boolean }} The logout result.
   */
  const logout = useCallback(() => {
    setError(null);

    const result = sessionLogout();

    setIsAuthenticated(false);
    setUser(null);
    setLoginTimestamp(null);

    return result;
  }, []);

  const simulationHint = isAuthenticated ? SIMULATION_HINT_TEXT.personalInfo : '';

  const value = useMemo(() => ({
    isAuthenticated,
    user,
    loginTimestamp,
    login,
    signup,
    logout,
    error,
    simulationHint,
  }), [isAuthenticated, user, loginTimestamp, login, signup, logout, error, simulationHint]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access the authentication context.
 * Must be used within an AuthProvider.
 *
 * @returns {AuthContextValue} The authentication context value.
 *
 * @example
 * const { isAuthenticated, user, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export default AuthContext;