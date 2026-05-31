import { useState, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext.jsx';

const NAV_LINKS = [
  { to: '/personal-info', label: 'Personal Info' },
  { to: '/representatives', label: 'Representatives' },
  { to: '/privacy-security', label: 'Privacy & Security' },
  { to: '/communication-preferences', label: 'Communication Preferences' },
  { to: '/pcp', label: 'PCP' },
  { to: '/care-manager', label: 'Care Manager' },
];

/**
 * Determines the CSS classes for a NavLink based on its active state.
 *
 * @param {boolean} isActive - Whether the link is currently active.
 * @param {string} [baseClasses=''] - Additional base classes to apply.
 * @returns {string} The computed class string.
 */
function getLinkClasses(isActive, baseClasses = '') {
  const common = 'rounded-md px-3 py-2 text-sm font-medium transition-colors';
  if (isActive) {
    return `${common} bg-csnp-700 text-white ${baseClasses}`.trim();
  }
  return `${common} text-csnp-100 hover:bg-csnp-500 hover:text-white ${baseClasses}`.trim();
}

/**
 * Determines the CSS classes for a mobile NavLink based on its active state.
 *
 * @param {boolean} isActive - Whether the link is currently active.
 * @returns {string} The computed class string.
 */
function getMobileLinkClasses(isActive) {
  const common = 'block rounded-md px-3 py-2 text-base font-medium transition-colors';
  if (isActive) {
    return `${common} bg-csnp-700 text-white`;
  }
  return `${common} text-csnp-100 hover:bg-csnp-500 hover:text-white`;
}

/**
 * Navigation bar component for the CSNP Member Portal.
 * Displays the portal title, navigation links, and a logout button.
 * Highlights the active route. Responsive with a mobile hamburger menu.
 * Uses the useAuth hook for session state and logout functionality.
 *
 * @returns {React.ReactElement} The Navbar component.
 */
export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const appTitle = import.meta.env.VITE_APP_TITLE || 'CSNP Member Portal';

  const handleLogout = useCallback(() => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  }, [logout, navigate]);

  const handleToggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleMobileLinkClick = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-csnp-600 shadow-md" aria-label="Main navigation">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Title */}
          <div className="flex flex-shrink-0 items-center">
            <NavLink
              to="/personal-info"
              className="text-lg font-bold text-white hover:text-csnp-100 transition-colors"
              aria-label={`${appTitle} - Home`}
            >
              {appTitle}
            </NavLink>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => getLinkClasses(isActive)}
                aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop User Info & Logout */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {user && (
              <span className="text-sm text-csnp-100">
                {user.firstName} {user.lastName}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-csnp-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-csnp-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-csnp-600"
              aria-label="Log out"
            >
              Logout
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={handleToggleMobileMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-csnp-100 hover:bg-csnp-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-csnp-600"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => getMobileLinkClasses(isActive)}
                onClick={handleMobileLinkClick}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="border-t border-csnp-500 px-4 pb-3 pt-3">
            {user && (
              <p className="mb-2 text-sm text-csnp-100">
                {user.firstName} {user.lastName}
              </p>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-md bg-csnp-700 px-3 py-2 text-base font-medium text-white transition-colors hover:bg-csnp-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-csnp-600"
              aria-label="Log out"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;