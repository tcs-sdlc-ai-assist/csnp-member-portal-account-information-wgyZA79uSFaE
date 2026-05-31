/**
 * Simulated session/auth manager for the CSNP Member Portal.
 * Provides mock login, signup, logout, and session retrieval.
 * Session is stored in-memory only (not localStorage) for security simulation.
 * @module sessionManager
 */

import { safeLog } from '../utils/piiMasker.js';
import { defaultPersonalInfo } from '../data/mockData.js';

/**
 * In-memory session state. Not persisted to localStorage for security simulation.
 * @type {{ loggedIn: boolean, user: Object|null, loginTimestamp: string|null }}
 */
let currentSession = {
  loggedIn: false,
  user: null,
  loginTimestamp: null,
};

/**
 * Retrieves the current session state.
 *
 * @returns {{ loggedIn: boolean, user: Object|null, loginTimestamp: string|null }} The current session.
 *
 * @example
 * const session = getSession();
 * // { loggedIn: false, user: null, loginTimestamp: null }
 */
export function getSession() {
  return { ...currentSession, user: currentSession.user ? { ...currentSession.user } : null };
}

/**
 * Simulates user authentication. Always succeeds with mock user data.
 * In a real application, this would validate credentials against a backend.
 *
 * @param {string} username - The username to authenticate with.
 * @param {string} password - The password to authenticate with.
 * @returns {{ success: boolean, session?: Object, error?: string }} The login result.
 *
 * @example
 * const result = login('jane.doe', 'password123');
 * // { success: true, session: { loggedIn: true, user: { ... }, loginTimestamp: '...' } }
 */
export function login(username, password) {
  try {
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      safeLog('SessionManager', { message: 'Login failed: username is required' });
      return { success: false, error: 'Username is required' };
    }

    if (!password || typeof password !== 'string' || password.trim().length === 0) {
      safeLog('SessionManager', { message: 'Login failed: password is required' });
      return { success: false, error: 'Password is required' };
    }

    const user = {
      firstName: defaultPersonalInfo.firstName,
      lastName: defaultPersonalInfo.lastName,
      memberId: defaultPersonalInfo.memberId,
      email: defaultPersonalInfo.email,
      planName: defaultPersonalInfo.planName,
      username: username.trim(),
    };

    currentSession = {
      loggedIn: true,
      user,
      loginTimestamp: new Date().toISOString(),
    };

    safeLog('SessionManager', { message: 'Login successful', username: username.trim() });

    return { success: true, session: getSession() };
  } catch (_err) {
    safeLog('SessionManager', { message: 'Login failed due to unexpected error' });
    return { success: false, error: 'An unexpected error occurred during login' };
  }
}

/**
 * Simulates user registration. Always succeeds with the provided user data.
 * In a real application, this would create a new account via a backend service.
 *
 * @param {Object} userData - The user data for registration.
 * @param {string} userData.firstName - The user's first name.
 * @param {string} userData.lastName - The user's last name.
 * @param {string} userData.email - The user's email address.
 * @param {string} [userData.username] - The desired username.
 * @param {string} [userData.password] - The desired password.
 * @returns {{ success: boolean, session?: Object, error?: string }} The signup result.
 *
 * @example
 * const result = signup({ firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', username: 'janedoe', password: 'pass123' });
 * // { success: true, session: { loggedIn: true, user: { ... }, loginTimestamp: '...' } }
 */
export function signup(userData) {
  try {
    if (!userData || typeof userData !== 'object') {
      safeLog('SessionManager', { message: 'Signup failed: user data is required' });
      return { success: false, error: 'User data is required' };
    }

    if (!userData.firstName || typeof userData.firstName !== 'string' || userData.firstName.trim().length === 0) {
      safeLog('SessionManager', { message: 'Signup failed: first name is required' });
      return { success: false, error: 'First name is required' };
    }

    if (!userData.lastName || typeof userData.lastName !== 'string' || userData.lastName.trim().length === 0) {
      safeLog('SessionManager', { message: 'Signup failed: last name is required' });
      return { success: false, error: 'Last name is required' };
    }

    if (!userData.email || typeof userData.email !== 'string' || userData.email.trim().length === 0) {
      safeLog('SessionManager', { message: 'Signup failed: email is required' });
      return { success: false, error: 'Email is required' };
    }

    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!emailRegex.test(userData.email.trim())) {
      safeLog('SessionManager', { message: 'Signup failed: invalid email format' });
      return { success: false, error: 'Invalid email format' };
    }

    const user = {
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      memberId: defaultPersonalInfo.memberId,
      email: userData.email.trim(),
      planName: defaultPersonalInfo.planName,
      username: userData.username ? userData.username.trim() : userData.email.trim(),
    };

    currentSession = {
      loggedIn: true,
      user,
      loginTimestamp: new Date().toISOString(),
    };

    safeLog('SessionManager', { message: 'Signup successful', email: userData.email.trim() });

    return { success: true, session: getSession() };
  } catch (_err) {
    safeLog('SessionManager', { message: 'Signup failed due to unexpected error' });
    return { success: false, error: 'An unexpected error occurred during signup' };
  }
}

/**
 * Clears the current session, simulating a logout.
 *
 * @returns {{ success: boolean }} The logout result.
 *
 * @example
 * const result = logout();
 * // { success: true }
 */
export function logout() {
  try {
    currentSession = {
      loggedIn: false,
      user: null,
      loginTimestamp: null,
    };

    safeLog('SessionManager', { message: 'Logout successful' });

    return { success: true };
  } catch (_err) {
    safeLog('SessionManager', { message: 'Logout failed due to unexpected error' });
    return { success: false };
  }
}