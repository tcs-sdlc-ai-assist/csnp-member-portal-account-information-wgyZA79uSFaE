import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { SimulationHint } from '../shared/SimulationHint.jsx';

/**
 * Mock login page component for the CSNP Member Portal.
 * Displays a login form with username and password fields.
 * On submit, calls useAuth login (always succeeds with mock data).
 * Shows a SimulationHint indicating authentication is simulated.
 * Redirects to /personal-info on successful login.
 *
 * @returns {React.ReactElement} The LoginPage component.
 */
export default function LoginPage() {
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const appTitle = import.meta.env.VITE_APP_TITLE || 'CSNP Member Portal';

  /**
   * Validates the login form fields.
   *
   * @returns {{ valid: boolean, errors: Object }} Validation result.
   */
  const validateForm = useCallback(() => {
    const errors = {};

    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      errors.username = 'Username is required';
    }

    if (!password || typeof password !== 'string' || password.trim().length === 0) {
      errors.password = 'Password is required';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }, [username, password]);

  /**
   * Handles form submission for login.
   *
   * @param {React.FormEvent} event - The form submit event.
   */
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      setFormErrors({});
      setIsSubmitting(true);

      const validation = validateForm();

      if (!validation.valid) {
        setFormErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      const result = login(username.trim(), password.trim());

      if (result.success) {
        navigate('/personal-info', { replace: true });
      } else {
        setFormErrors({ form: result.error || 'Login failed. Please try again.' });
        setIsSubmitting(false);
      }
    },
    [username, password, login, navigate, validateForm]
  );

  /**
   * Handles username input change.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value);
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next.username;
      delete next.form;
      return next;
    });
  }, []);

  /**
   * Handles password input change.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handlePasswordChange = useCallback((event) => {
    setPassword(event.target.value);
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next.password;
      delete next.form;
      return next;
    });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {appTitle}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your member portal
          </p>
        </div>

        {/* Simulation Hint */}
        <SimulationHint
          message="This is a simulated login. Any username and password combination will be accepted for demonstration purposes."
          variant="banner"
        />

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {/* Form-level error */}
          {(formErrors.form || authError) && (
            <div
              role="alert"
              className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {formErrors.form || authError}
            </div>
          )}

          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={handleUsernameChange}
                aria-invalid={formErrors.username ? 'true' : 'false'}
                aria-describedby={formErrors.username ? 'username-error' : undefined}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  formErrors.username
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-csnp-500 focus:ring-csnp-500'
                }`}
                placeholder="Enter your username"
              />
              {formErrors.username && (
                <p id="username-error" className="mt-1 text-xs text-red-600" role="alert">
                  {formErrors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={handlePasswordChange}
                aria-invalid={formErrors.password ? 'true' : 'false'}
                aria-describedby={formErrors.password ? 'password-error' : undefined}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  formErrors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-csnp-500 focus:ring-csnp-500'
                }`}
                placeholder="Enter your password"
              />
              {formErrors.password && (
                <p id="password-error" className="mt-1 text-xs text-red-600" role="alert">
                  {formErrors.password}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>
          </div>

          {/* Signup Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-csnp-600 transition-colors hover:text-csnp-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>

        {/* Footer Disclaimer */}
        <p className="text-center text-xs text-gray-500">
          This is a simulated member portal for demonstration purposes only. All data shown is fictitious.
        </p>
      </div>
    </div>
  );
}