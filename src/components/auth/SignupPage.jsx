import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { SimulationHint } from '../shared/SimulationHint.jsx';

/**
 * Mock signup page component for the CSNP Member Portal.
 * Displays a registration form with first name, last name, email,
 * password, and confirm password fields.
 * On submit, calls useAuth signup (always succeeds with mock data).
 * Shows a SimulationHint indicating registration is simulated.
 * Redirects to login page on successful signup.
 *
 * @returns {React.ReactElement} The SignupPage component.
 */
export default function SignupPage() {
  const { signup, error: authError } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const appTitle = import.meta.env.VITE_APP_TITLE || 'CSNP Member Portal';

  /**
   * Validates the signup form fields.
   *
   * @returns {{ valid: boolean, errors: Object }} Validation result.
   */
  const validateForm = useCallback(() => {
    const errors = {};

    if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
      errors.firstName = 'First name is required';
    }

    if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
      errors.lastName = 'Last name is required';
    }

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = 'Please enter a valid email address';
      }
    }

    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      errors.username = 'Username is required';
    }

    if (!password || typeof password !== 'string' || password.trim().length === 0) {
      errors.password = 'Password is required';
    } else if (password.trim().length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword || typeof confirmPassword !== 'string' || confirmPassword.trim().length === 0) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password.trim() !== confirmPassword.trim()) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }, [firstName, lastName, email, username, password, confirmPassword]);

  /**
   * Handles form submission for signup.
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

      const result = signup({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        username: username.trim(),
        password: password.trim(),
      });

      if (result.success) {
        navigate('/personal-info', { replace: true });
      } else {
        setFormErrors({ form: result.error || 'Signup failed. Please try again.' });
        setIsSubmitting(false);
      }
    },
    [firstName, lastName, email, username, password, signup, navigate, validateForm]
  );

  /**
   * Clears a specific field error when the user types.
   *
   * @param {string} field - The field name to clear errors for.
   */
  const clearFieldError = useCallback((field) => {
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      delete next.form;
      return next;
    });
  }, []);

  /**
   * Handles first name input change.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleFirstNameChange = useCallback((event) => {
    setFirstName(event.target.value);
    clearFieldError('firstName');
  }, [clearFieldError]);

  /**
   * Handles last name input change.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleLastNameChange = useCallback((event) => {
    setLastName(event.target.value);
    clearFieldError('lastName');
  }, [clearFieldError]);

  /**
   * Handles email input change.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleEmailChange = useCallback((event) => {
    setEmail(event.target.value);
    clearFieldError('email');
  }, [clearFieldError]);

  /**
   * Handles username input change.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value);
    clearFieldError('username');
  }, [clearFieldError]);

  /**
   * Handles password input change.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handlePasswordChange = useCallback((event) => {
    setPassword(event.target.value);
    clearFieldError('password');
  }, [clearFieldError]);

  /**
   * Handles confirm password input change.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleConfirmPasswordChange = useCallback((event) => {
    setConfirmPassword(event.target.value);
    clearFieldError('confirmPassword');
  }, [clearFieldError]);

  /**
   * Returns the appropriate input CSS classes based on error state.
   *
   * @param {string} fieldName - The field name to check for errors.
   * @returns {string} The computed class string.
   */
  const getInputClasses = (fieldName) => {
    const base = 'mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1';
    if (formErrors[fieldName]) {
      return `${base} border-red-300 focus:border-red-500 focus:ring-red-500`;
    }
    return `${base} border-gray-300 focus:border-csnp-500 focus:ring-csnp-500`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {appTitle}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to get started
          </p>
        </div>

        {/* Simulation Hint */}
        <SimulationHint
          message="This is a simulated registration. Any information entered will be accepted for demonstration purposes. No real account will be created."
          variant="banner"
        />

        {/* Signup Form */}
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
            {/* First Name and Last Name Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* First Name Field */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={handleFirstNameChange}
                  aria-invalid={formErrors.firstName ? 'true' : 'false'}
                  aria-describedby={formErrors.firstName ? 'firstName-error' : undefined}
                  className={getInputClasses('firstName')}
                  placeholder="First name"
                />
                {formErrors.firstName && (
                  <p id="firstName-error" className="mt-1 text-xs text-red-600" role="alert">
                    {formErrors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name Field */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={handleLastNameChange}
                  aria-invalid={formErrors.lastName ? 'true' : 'false'}
                  aria-describedby={formErrors.lastName ? 'lastName-error' : undefined}
                  className={getInputClasses('lastName')}
                  placeholder="Last name"
                />
                {formErrors.lastName && (
                  <p id="lastName-error" className="mt-1 text-xs text-red-600" role="alert">
                    {formErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={handleEmailChange}
                aria-invalid={formErrors.email ? 'true' : 'false'}
                aria-describedby={formErrors.email ? 'email-error' : undefined}
                className={getInputClasses('email')}
                placeholder="Enter your email address"
              />
              {formErrors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-600" role="alert">
                  {formErrors.email}
                </p>
              )}
            </div>

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
                className={getInputClasses('username')}
                placeholder="Choose a username"
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
                autoComplete="new-password"
                required
                value={password}
                onChange={handlePasswordChange}
                aria-invalid={formErrors.password ? 'true' : 'false'}
                aria-describedby={formErrors.password ? 'password-error' : undefined}
                className={getInputClasses('password')}
                placeholder="Create a password"
              />
              {formErrors.password && (
                <p id="password-error" className="mt-1 text-xs text-red-600" role="alert">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                aria-invalid={formErrors.confirmPassword ? 'true' : 'false'}
                aria-describedby={formErrors.confirmPassword ? 'confirmPassword-error' : undefined}
                className={getInputClasses('confirmPassword')}
                placeholder="Confirm your password"
              />
              {formErrors.confirmPassword && (
                <p id="confirmPassword-error" className="mt-1 text-xs text-red-600" role="alert">
                  {formErrors.confirmPassword}
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
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/"
                className="font-medium text-csnp-600 transition-colors hover:text-csnp-500"
              >
                Log in
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