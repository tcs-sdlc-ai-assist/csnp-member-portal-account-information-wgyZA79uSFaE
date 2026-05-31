import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

/**
 * Route guard component that protects routes requiring authentication.
 * Checks the current authentication state via useAuth and redirects
 * unauthenticated users to the login page. Renders children if the
 * user has an active session.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render when authenticated.
 * @returns {React.ReactElement} The protected content or a redirect to the login page.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;