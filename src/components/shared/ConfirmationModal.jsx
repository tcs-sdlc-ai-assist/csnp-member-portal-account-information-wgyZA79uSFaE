import { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Maps variant names to their corresponding icon, color, and button styles.
 * @type {Object.<string, Object>}
 */
const VARIANT_CONFIG = {
  success: {
    iconBgClass: 'bg-green-100',
    iconTextClass: 'text-green-600',
    buttonClass: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    icon: (
      <svg
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ),
  },
  error: {
    iconBgClass: 'bg-red-100',
    iconTextClass: 'text-red-600',
    buttonClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    icon: (
      <svg
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
    ),
  },
  warning: {
    iconBgClass: 'bg-amber-100',
    iconTextClass: 'text-amber-600',
    buttonClass: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
    icon: (
      <svg
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
    ),
  },
};

/**
 * Reusable modal dialog for confirmations and alerts.
 * Supports success, error, and warning variants with appropriate styling.
 * Includes focus trap and aria-modal for accessibility.
 *
 * @param {Object} props
 * @param {string} props.title - The modal title text.
 * @param {string} props.message - The modal message/body text.
 * @param {function} props.onConfirm - Callback invoked when the confirm button is clicked.
 * @param {function} [props.onCancel] - Callback invoked when the cancel button is clicked or the modal is dismissed.
 * @param {'success'|'error'|'warning'} [props.variant='warning'] - The visual variant of the modal.
 * @param {string} [props.confirmLabel='Confirm'] - Label for the confirm button.
 * @param {string} [props.cancelLabel='Cancel'] - Label for the cancel button.
 * @param {boolean} [props.showCancel=true] - Whether to show the cancel button.
 * @returns {React.ReactElement} The ConfirmationModal component.
 */
export function ConfirmationModal({
  title,
  message,
  onConfirm,
  onCancel,
  variant = 'warning',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  showCancel = true,
}) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const confirmButtonRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.warning;

  /**
   * Handles keyboard events for focus trapping and escape key dismissal.
   */
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (onCancel) {
          onCancel();
        }
        return;
      }

      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [onCancel]
  );

  /**
   * Handles clicks on the overlay backdrop to dismiss the modal.
   */
  const handleOverlayClick = useCallback(
    (event) => {
      if (event.target === overlayRef.current && onCancel) {
        onCancel();
      }
    },
    [onCancel]
  );

  useEffect(() => {
    previousActiveElementRef.current = document.activeElement;

    if (confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }

    document.addEventListener('keydown', handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;

      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus();
      }
    };
  }, [handleKeyDown]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 transition-opacity"
      role="presentation"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-message"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${config.iconBgClass}`}
          >
            <span className={config.iconTextClass}>{config.icon}</span>
          </div>
        </div>

        {/* Title */}
        <h2
          id="confirmation-modal-title"
          className="mt-4 text-center text-lg font-semibold text-gray-900"
        >
          {title}
        </h2>

        {/* Message */}
        <p
          id="confirmation-modal-message"
          className="mt-2 text-center text-sm text-gray-600"
        >
          {message}
        </p>

        {/* Actions */}
        <div
          className={`mt-6 flex ${showCancel ? 'flex-col-reverse gap-3 sm:flex-row sm:justify-center' : 'justify-center'}`}
        >
          {showCancel && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-csnp-500 focus:ring-offset-2 sm:w-auto"
            >
              {cancelLabel}
            </button>
          )}
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto ${config.buttonClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmationModal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'error', 'warning']),
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  showCancel: PropTypes.bool,
};

export default ConfirmationModal;