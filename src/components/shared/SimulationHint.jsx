import PropTypes from 'prop-types';

/**
 * Reusable simulation hint component that displays a prominent banner or inline hint
 * indicating that data and integrations are mocked.
 *
 * @param {Object} props
 * @param {string} props.message - The hint message to display.
 * @param {'banner'|'inline'|'tooltip'} [props.variant='banner'] - The display variant.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @returns {React.ReactElement|null} The SimulationHint component, or null if no message.
 */
export function SimulationHint({ message, variant = 'banner', className = '' }) {
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return null;
  }

  const infoIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={variant === 'tooltip' ? 'h-4 w-4 flex-shrink-0' : 'h-5 w-5 flex-shrink-0'}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
        clipRule="evenodd"
      />
    </svg>
  );

  if (variant === 'banner') {
    return (
      <div
        role="alert"
        aria-live="polite"
        className={`flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm ${className}`}
      >
        <span className="text-amber-500">{infoIcon}</span>
        <p className="leading-5">{message}</p>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div
        role="alert"
        aria-live="polite"
        className={`flex items-start gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700 ${className}`}
      >
        <span className="mt-0.5 text-amber-400">{infoIcon}</span>
        <p className="leading-4">{message}</p>
      </div>
    );
  }

  if (variant === 'tooltip') {
    return (
      <span
        role="alert"
        aria-live="polite"
        className={`inline-flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-700 ${className}`}
      >
        <span className="text-amber-400">{infoIcon}</span>
        <span>{message}</span>
      </span>
    );
  }

  return null;
}

SimulationHint.propTypes = {
  message: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['banner', 'inline', 'tooltip']),
  className: PropTypes.string,
};

export default SimulationHint;