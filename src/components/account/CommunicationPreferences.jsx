import { useState, useCallback } from 'react';
import { useCommunicationPreferences } from '../../contexts/CommunicationPreferencesContext.jsx';
import { SimulationHint } from '../shared/SimulationHint.jsx';
import { ConfirmationModal } from '../shared/ConfirmationModal.jsx';
import { SIMULATION_HINT_TEXT, NOTIFICATION_METHODS } from '../../utils/constants.js';

/**
 * Communication preferences component for the CSNP Member Portal.
 * Displays paperless delivery toggle, notification method selectors per category,
 * delivery email field, preferred language, and do-not-call hours.
 * Uses useCommunicationPreferences context hook. On change, updates preferences
 * and shows confirmation message. Shows SimulationHint.
 * Accessible toggle switches and radio groups.
 *
 * @returns {React.ReactElement} The CommunicationPreferences component.
 */
export default function CommunicationPreferences() {
  const {
    preferences,
    loading,
    error: contextError,
    updateCommunicationPreferences,
  } = useCommunicationPreferences();

  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  /**
   * Enters edit mode and populates edit values from current preferences.
   */
  const handleEdit = useCallback(() => {
    setEditValues({
      paperless: preferences.paperless || false,
      deliveryEmail: preferences.deliveryEmail || '',
      preferredLanguage: preferences.preferredLanguage || 'English',
      categoryPreferences: preferences.categoryPreferences
        ? preferences.categoryPreferences.map((cp) => ({
            category: cp.category,
            methods: cp.methods ? [...cp.methods] : [],
            enabled: cp.enabled !== undefined ? cp.enabled : true,
          }))
        : [],
      doNotCallHours: preferences.doNotCallHours
        ? { ...preferences.doNotCallHours }
        : { start: '21:00', end: '08:00' },
    });
    setFormErrors({});
    setIsEditing(true);
  }, [preferences]);

  /**
   * Cancels editing and resets form state.
   */
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditValues({});
    setFormErrors({});
  }, []);

  /**
   * Handles paperless toggle change.
   */
  const handlePaperlessToggle = useCallback(() => {
    setEditValues((prev) => ({ ...prev, paperless: !prev.paperless }));
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next.form;
      return next;
    });
  }, []);

  /**
   * Handles delivery email input change.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleEmailChange = useCallback((event) => {
    const { value } = event.target;
    setEditValues((prev) => ({ ...prev, deliveryEmail: value }));
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next.deliveryEmail;
      delete next.form;
      return next;
    });
  }, []);

  /**
   * Handles preferred language input change.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} event - The select change event.
   */
  const handleLanguageChange = useCallback((event) => {
    const { value } = event.target;
    setEditValues((prev) => ({ ...prev, preferredLanguage: value }));
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next.form;
      return next;
    });
  }, []);

  /**
   * Handles do-not-call hours change.
   *
   * @param {string} field - The field name ('start' or 'end').
   * @param {string} value - The new time value.
   */
  const handleDoNotCallChange = useCallback((field, value) => {
    setEditValues((prev) => ({
      ...prev,
      doNotCallHours: {
        ...prev.doNotCallHours,
        [field]: value,
      },
    }));
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next.form;
      return next;
    });
  }, []);

  /**
   * Handles category enabled toggle.
   *
   * @param {number} index - The index of the category preference.
   */
  const handleCategoryToggle = useCallback((index) => {
    setEditValues((prev) => {
      const updated = prev.categoryPreferences.map((cp, i) => {
        if (i === index) {
          return { ...cp, enabled: !cp.enabled };
        }
        return { ...cp };
      });
      return { ...prev, categoryPreferences: updated };
    });
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next.form;
      return next;
    });
  }, []);

  /**
   * Handles notification method toggle for a category.
   *
   * @param {number} index - The index of the category preference.
   * @param {string} method - The notification method to toggle.
   */
  const handleMethodToggle = useCallback((index, method) => {
    setEditValues((prev) => {
      const updated = prev.categoryPreferences.map((cp, i) => {
        if (i === index) {
          const currentMethods = cp.methods || [];
          const newMethods = currentMethods.includes(method)
            ? currentMethods.filter((m) => m !== method)
            : [...currentMethods, method];
          return { ...cp, methods: newMethods };
        }
        return { ...cp };
      });
      return { ...prev, categoryPreferences: updated };
    });
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next.form;
      return next;
    });
  }, []);

  /**
   * Validates the edit form fields.
   *
   * @returns {{ valid: boolean, errors: Object }} Validation result.
   */
  const validateForm = useCallback(() => {
    const errors = {};

    if (
      !editValues.deliveryEmail ||
      typeof editValues.deliveryEmail !== 'string' ||
      editValues.deliveryEmail.trim().length === 0
    ) {
      errors.deliveryEmail = 'Delivery email is required';
    } else {
      const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
      if (!emailRegex.test(editValues.deliveryEmail.trim())) {
        errors.deliveryEmail = 'Please enter a valid email address';
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }, [editValues]);

  /**
   * Handles form submission for saving communication preferences.
   *
   * @param {React.FormEvent} event - The form submit event.
   */
  const handleSave = useCallback(
    (event) => {
      event.preventDefault();
      setFormErrors({});

      const validation = validateForm();

      if (!validation.valid) {
        setFormErrors(validation.errors);
        return;
      }

      const updatedData = {
        paperless: editValues.paperless,
        deliveryEmail: editValues.deliveryEmail.trim(),
        preferredLanguage: editValues.preferredLanguage,
        categoryPreferences: editValues.categoryPreferences,
        doNotCallHours: editValues.doNotCallHours,
      };

      const result = updateCommunicationPreferences(updatedData);

      if (result.success) {
        setIsEditing(false);
        setEditValues({});
        setShowConfirmation(true);
      } else {
        setFormErrors({
          form: result.error || 'Failed to update communication preferences. Please try again.',
        });
      }
    },
    [editValues, validateForm, updateCommunicationPreferences]
  );

  /**
   * Closes the confirmation modal.
   */
  const handleCloseConfirmation = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  /**
   * Returns the appropriate input CSS classes based on error state.
   *
   * @param {string} fieldName - The field name to check for errors.
   * @returns {string} The computed class string.
   */
  const getInputClasses = (fieldName) => {
    const base =
      'mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1';
    if (formErrors[fieldName]) {
      return `${base} border-red-300 focus:border-red-500 focus:ring-red-500`;
    }
    return `${base} border-gray-300 focus:border-csnp-500 focus:ring-csnp-500`;
  };

  /**
   * Renders a read-only info row with label and value.
   *
   * @param {string} label - The field label.
   * @param {string|React.ReactNode} value - The field value.
   * @returns {React.ReactElement} The info row element.
   */
  const renderInfoRow = (label, value) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 py-3 last:border-b-0">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:text-right">{value || '—'}</dd>
    </div>
  );

  /**
   * Renders a toggle display row.
   *
   * @param {string} label - The toggle label.
   * @param {boolean} value - The toggle value.
   * @returns {React.ReactElement} The toggle row element.
   */
  const renderToggleRow = (label, value) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 py-3 last:border-b-0">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 sm:mt-0 sm:text-right">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {value ? 'Enabled' : 'Disabled'}
        </span>
      </dd>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Communication Preferences
          </h1>
          <p className="mt-1 text-sm text-gray-600">Loading your communication preferences...</p>
        </div>
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Communication Preferences
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage how you receive notifications and communications from your health plan.
        </p>
      </div>

      {/* Simulation Hint */}
      <SimulationHint message={SIMULATION_HINT_TEXT.communicationPreferences} variant="banner" />

      {/* Context Error */}
      {contextError && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {contextError}
        </div>
      )}

      {/* Delivery Settings Card */}
      <div className="card">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Delivery Settings</h2>
          {!isEditing && (
            <button type="button" onClick={handleEdit} className="btn-secondary">
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} noValidate className="mt-4 space-y-6">
            {/* Form-level error */}
            {formErrors.form && (
              <div
                role="alert"
                className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {formErrors.form}
              </div>
            )}

            {/* Paperless Toggle */}
            <label className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-900">Paperless Delivery</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  Receive all communications electronically instead of by mail
                </p>
              </div>
              <input
                type="checkbox"
                checked={editValues.paperless || false}
                onChange={handlePaperlessToggle}
                className="h-4 w-4 rounded border-gray-300 text-csnp-600 focus:ring-csnp-500"
                aria-label="Paperless Delivery"
              />
            </label>

            {/* Delivery Email */}
            <div>
              <label
                htmlFor="deliveryEmail"
                className="block text-sm font-medium text-gray-700"
              >
                Delivery Email Address
              </label>
              <input
                id="deliveryEmail"
                name="deliveryEmail"
                type="email"
                autoComplete="email"
                required
                value={editValues.deliveryEmail || ''}
                onChange={handleEmailChange}
                aria-invalid={formErrors.deliveryEmail ? 'true' : 'false'}
                aria-describedby={
                  formErrors.deliveryEmail ? 'deliveryEmail-error' : undefined
                }
                className={getInputClasses('deliveryEmail')}
                placeholder="Enter your delivery email address"
              />
              {formErrors.deliveryEmail && (
                <p
                  id="deliveryEmail-error"
                  className="mt-1 text-xs text-red-600"
                  role="alert"
                >
                  {formErrors.deliveryEmail}
                </p>
              )}
            </div>

            {/* Preferred Language */}
            <div>
              <label
                htmlFor="preferredLanguage"
                className="block text-sm font-medium text-gray-700"
              >
                Preferred Language
              </label>
              <select
                id="preferredLanguage"
                name="preferredLanguage"
                value={editValues.preferredLanguage || 'English'}
                onChange={handleLanguageChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-csnp-500 focus:ring-csnp-500"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="Mandarin">Mandarin</option>
                <option value="Vietnamese">Vietnamese</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            {/* Do Not Call Hours */}
            <div>
              <p className="block text-sm font-medium text-gray-700">Do Not Call Hours</p>
              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="doNotCallStart"
                    className="block text-xs text-gray-500"
                  >
                    Start Time
                  </label>
                  <input
                    id="doNotCallStart"
                    type="time"
                    value={
                      editValues.doNotCallHours
                        ? editValues.doNotCallHours.start || ''
                        : ''
                    }
                    onChange={(e) => handleDoNotCallChange('start', e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-csnp-500 focus:ring-csnp-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="doNotCallEnd"
                    className="block text-xs text-gray-500"
                  >
                    End Time
                  </label>
                  <input
                    id="doNotCallEnd"
                    type="time"
                    value={
                      editValues.doNotCallHours
                        ? editValues.doNotCallHours.end || ''
                        : ''
                    }
                    onChange={(e) => handleDoNotCallChange('end', e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-csnp-500 focus:ring-csnp-500"
                  />
                </div>
              </div>
            </div>

            {/* Category Preferences */}
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-3">
                Notification Categories
              </p>
              <div className="space-y-3">
                {editValues.categoryPreferences &&
                  editValues.categoryPreferences.map((cp, index) => (
                    <div
                      key={cp.category}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-gray-900">
                          {cp.category}
                        </p>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <span className="text-xs text-gray-500">
                            {cp.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                          <input
                            type="checkbox"
                            checked={cp.enabled || false}
                            onChange={() => handleCategoryToggle(index)}
                            className="h-4 w-4 rounded border-gray-300 text-csnp-600 focus:ring-csnp-500"
                            aria-label={`Enable ${cp.category} notifications`}
                          />
                        </label>
                      </div>

                      {cp.enabled && (
                        <fieldset>
                          <legend className="sr-only">
                            Notification methods for {cp.category}
                          </legend>
                          <div className="flex flex-wrap gap-2">
                            {NOTIFICATION_METHODS.map((method) => (
                              <label
                                key={method}
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium cursor-pointer transition-colors ${
                                  (cp.methods || []).includes(method)
                                    ? 'border-csnp-300 bg-csnp-50 text-csnp-700'
                                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={(cp.methods || []).includes(method)}
                                  onChange={() => handleMethodToggle(index, method)}
                                  className="sr-only"
                                  aria-label={`${method} for ${cp.category}`}
                                />
                                {method}
                              </label>
                            ))}
                          </div>
                        </fieldset>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Preferences
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="mt-4 space-y-6">
            {/* Delivery Settings */}
            <dl className="divide-y divide-gray-100">
              {renderToggleRow('Paperless Delivery', preferences.paperless)}
              {renderInfoRow('Delivery Email', preferences.deliveryEmail)}
              {renderInfoRow('Preferred Language', preferences.preferredLanguage)}
              {renderInfoRow(
                'Do Not Call Hours',
                preferences.doNotCallHours
                  ? `${preferences.doNotCallHours.start} – ${preferences.doNotCallHours.end}`
                  : '—'
              )}
            </dl>

            {/* Category Preferences */}
            {preferences.categoryPreferences &&
              preferences.categoryPreferences.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Notification Categories
                  </h3>
                  <div className="space-y-3">
                    {preferences.categoryPreferences.map((cp) => (
                      <div
                        key={cp.category}
                        className="rounded-lg border border-gray-200 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {cp.category}
                          </p>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              cp.enabled
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {cp.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        {cp.enabled &&
                          cp.methods &&
                          cp.methods.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {cp.methods.map((method) => (
                                <span
                                  key={method}
                                  className="inline-flex items-center rounded-full bg-csnp-50 px-2 py-0.5 text-xs font-medium text-csnp-700"
                                >
                                  {method}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal
          title="Preferences Saved"
          message="Your communication preferences have been updated successfully."
          variant="success"
          confirmLabel="OK"
          showCancel={false}
          onConfirm={handleCloseConfirmation}
        />
      )}
    </div>
  );
}