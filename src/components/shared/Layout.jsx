import PropTypes from 'prop-types';
import { Navbar } from './Navbar.jsx';
import { SimulationHint } from './SimulationHint.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

/**
 * Main layout wrapper component for the CSNP Member Portal.
 * Renders the Navbar at the top, a global SimulationHint banner,
 * and the children content area within a main landmark.
 * Includes a skip-to-content link for accessibility and a footer
 * with a simulation disclaimer.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render in the content area.
 * @returns {React.ReactElement} The Layout component.
 */
export function Layout({ children }) {
  const { isAuthenticated, simulationHint } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-csnp-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-csnp-600"
      >
        Skip to main content
      </a>

      {/* Navigation bar */}
      <Navbar />

      {/* Global simulation hint banner */}
      {isAuthenticated && simulationHint && (
        <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <SimulationHint message={simulationHint} variant="banner" />
        </div>
      )}

      {/* Main content area */}
      <main
        id="main-content"
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8"
        role="main"
      >
        {children}
      </main>

      {/* Footer with simulation disclaimer */}
      <footer className="border-t border-gray-200 bg-white py-4" role="contentinfo">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-500">
            This is a simulated member portal for demonstration purposes only. All data shown is fictitious and does not represent real member information.
          </p>
        </div>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;