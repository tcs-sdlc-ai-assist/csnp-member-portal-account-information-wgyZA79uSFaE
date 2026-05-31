import { useState, useCallback } from 'react';
import { getPrivacySettings, updatePrivacySettings } from '../../services/mockRepository.js';
import { SimulationHint } from '../shared/SimulationHint.jsx';
import { ConfirmationModal } from '../shared/ConfirmationModal.jsx';
import { SIMULATION_HINT_TEXT } from '../../utils/constants.js';

/**
 * Privacy and security settings component for the CSNP Member Portal.
 * Displays current settings (password hint, security questions, two-factor,
 * HIPAA authorizations, data sharing) from mockRepository in a card layout.
 * Supports updating password (simulated – old/new/confirm fields) and
 * security questions. On save, calls updatePrivacySettings and shows confirmation.
 * Shows SimulationHint indicating no real security changes occur.
 * Accessible form fields with labels and error messages.
 *
 * @returns {React.ReactElement} The PrivacySecurity component.
 */
export default function PrivacySecurity() {
  const [privacySettings, setPrivacySettings] = useState(() => getPrivacySettings());
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingQuestions, setIsEditingQuestions] = useState(false);
  const [isEditingToggles, setIsEditingToggles] = useState(false);
  const [passwordValues, setPasswordValues] = useState({});
  const [questionsValues, setQuestionsValues] = useState([]);
  const [toggleValues, setToggleValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  /**
   * Opens the password change form.
   */
  const handleEditPassword = useCallback(() => {
    setPasswordValues({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      passwordHint: privacySettings.passwordHint || '',
    });
    setFormErrors({});
    setIsEditingPassword(true);
  }, [privacySettings]);

  /**
   * Cancels password editing and resets form state.
   */
  const handleCancelPassword = useCallback(() => {
    setIsEditingPassword(false);
    setPasswordValues({});
    setFormErrors({});
  }, []);

  /**
   * Opens the security questions edit form.
   */
  const handleEditQuestions = useCallback(() => {
    const questions = privacySettings.securityQuestions
      ? privacySettings.securityQuestions.map((q) => ({ ...q }))
      : [];
    setQuestionsValues(questions);
    setFormErrors({});
    setIsEditingQuestions(true);
  }, [privacySettings]);

  /**
   * Cancels security questions editing and resets form state.
   */
  const handleCancelQuestions = useCallback(() => {
    setIsEditingQuestions(false);
    setQuestionsValues([]);
    setFormErrors({});
  }, []);

  /**
   * Opens the privacy toggles edit form.
   */
  const handleEditToggles = useCallback(() => {
    setToggleValues({
      twoFactorEnabled: privacySettings.twoFactorEnabled || false,
      hipaaAuthorizationsOnFile: privacySettings.hipaaAuthorizationsOnFile || false,
      shareDataWithProviders: privacySettings.shareDataWithProviders || false,
      allowResearchUse: privacySettings.allowResearchUse || false,
    });
    setFormErrors({});
    setIsEditingToggles(true);
  }, [privacySettings]);

  /**
   * Cancels privacy toggles editing and resets form state.
   */
  const handleCancelToggles = useCallback(() => {
    setIsEditingToggles(false);
    setToggleValues({});
    setFormErrors({});
  }, []);

  /**
   * Handles input change for password fields.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handlePasswordInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setPasswordValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      delete next.form;
      return next;
    });
  }, []);

  /**
   * Handles input change for security question fields.
   *
   * @param {number} index - The index of the security question.
   * @param {string} field - The field name ('question' or 'answer').
   * @param {string} value - The new value.
   */
  const handleQuestionChange = useCallback((index, field, value) => {
    setQuestionsValues((prev) => {
      const updated = prev.map((q) => ({ ...q }));
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[`question_${index}`];
      delete next[`answer_${index}`];
      delete next.form;
      return next;
    });
  }, []);

  /**
   * Handles toggle change for privacy settings.
   *
   * @param {string} field - The toggle field name.
   */
  const handleToggleChange = useCallback((field) => {
    setToggleValues((prev) => ({ ...prev, [field]: !prev[field] }));
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next.form;
      return next;
    });
  }, []);

  /**
   * Validates the password change form.
   *
   * @returns {{ valid: boolean, errors: Object }} Validation result.
   */
  const validatePasswordForm = useCallback(() => {
    const errors = {};

    if (!passwordValues.oldPassword || typeof passwordValues.oldPassword !== 'string' || passwordValues.oldPassword.trim().length === 0) {
      errors.oldPassword = 'Current password is required';
    }

    if (!passwordValues.newPassword || typeof passwordValues.newPassword !== 'string' || passwordValues.newPassword.trim().length === 0) {
      errors.newPassword = 'New password is required';
    } else if (passwordValues.newPassword.trim().length < 6) {
      errors.newPassword = 'New password must be at least 6 characters';
    }

    if (!passwordValues.confirmPassword || typeof passwordValues.confirmPassword !== 'string' || passwordValues.confirmPassword.trim().length === 0) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordValues.newPassword && passwordValues.newPassword.trim() !== passwordValues.confirmPassword.trim()) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (passwordValues.passwordHint !== undefined && typeof passwordValues.passwordHint !== 'string') {
      errors.passwordHint = 'Password hint must be a string';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }, [passwordValues]);

  /**
   * Validates the security questions form.
   *
   * @returns {{ valid: boolean, errors: Object }} Validation result.
   */
  const validateQuestionsForm = useCallback(() => {
    const errors = {};

    questionsValues.forEach((q, index) => {
      if (!q.question || typeof q.question !== 'string' || q.question.trim().length === 0) {
        errors[`question_${index}`] = 'Security question is required';
      }
      if (!q.answer || typeof q.answer !== 'string' || q.answer.trim().length === 0) {
        errors[`answer_${index}`] = 'Answer is required';
      }
    });

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }, [questionsValues]);

  /**
   * Handles password change form submission.
   *
   * @param {React.FormEvent} event - The form submit event.
   */
  const handleSavePassword = useCallback(
    (event) => {
      event.preventDefault();
      setFormErrors({});

      const validation = validatePasswordForm();

      if (!validation.valid) {
        setFormErrors(validation.errors);
        return;
      }

      const updatedFields = {
        passwordHint: passwordValues.passwordHint ? passwordValues.passwordHint.trim() : privacySettings.passwordHint,
        lastPasswordChange: new Date().toISOString().split('T')[0],
      };

      const result = updatePrivacySettings(updatedFields);

      if (result.success) {
        setPrivacySettings(result.privacySettings);
        setIsEditingPassword(false);
        setPasswordValues({});
        setConfirmationMessage('Your password has been updated successfully.');
        setShowConfirmation(true);
      } else {
        setFormErrors({ form: result.error || 'Failed to update password. Please try again.' });
      }
    },
    [passwordValues, validatePasswordForm, privacySettings]
  );

  /**
   * Handles security questions form submission.
   *
   * @param {React.FormEvent} event - The form submit event.
   */
  const handleSaveQuestions = useCallback(
    (event) => {
      event.preventDefault();
      setFormErrors({});

      const validation = validateQuestionsForm();

      if (!validation.valid) {
        setFormErrors(validation.errors);
        return;
      }

      const trimmedQuestions = questionsValues.map((q) => ({
        question: q.question.trim(),
        answer: q.answer.trim(),
      }));

      const result = updatePrivacySettings({ securityQuestions: trimmedQuestions });

      if (result.success) {
        setPrivacySettings(result.privacySettings);
        setIsEditingQuestions(false);
        setQuestionsValues([]);
        setConfirmationMessage('Your security questions have been updated successfully.');
        setShowConfirmation(true);
      } else {
        setFormErrors({ form: result.error || 'Failed to update security questions. Please try again.' });
      }
    },
    [questionsValues, validateQuestionsForm]
  );

  /**
   * Handles privacy toggles form submission.
   *
   * @param {React.FormEvent} event - The form submit event.
   */
  const handleSaveToggles = useCallback(
    (event) => {
      event.preventDefault();
      setFormErrors({});

      const result = updatePrivacySettings({
        twoFactorEnabled: toggleValues.twoFactorEnabled,
        hipaaAuthorizationsOnFile: toggleValues.hipaaAuthorizationsOnFile,
        shareDataWithProviders: toggleValues.shareDataWithProviders,
        allowResearchUse: toggleValues.allowResearchUse,
      });

      if (result.success) {
        setPrivacySettings(result.privacySettings);
        setIsEditingToggles(false);
        setToggleValues({});
        setConfirmationMessage('Your privacy settings have been updated successfully.');
        setShowConfirmation(true);
      } else {
        setFormErrors({ form: result.error || 'Failed to update privacy settings. Please try again.' });
      }
    },
    [toggleValues]
  );

  /**
   * Closes the confirmation modal.
   */
  const handleCloseConfirmation = useCallback(() => {
    setShowConfirmation(false);
    setConfirmationMessage('');
  }, []);

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
            value
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {value ? 'Enabled' : 'Disabled'}
        </span>
      </dd>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Privacy & Security</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your password, security questions, and privacy preferences.
        </p>
      </div>

      {/* Simulation Hint */}
      <SimulationHint
        message={SIMULATION_HINT_TEXT.privacySettings}
        variant="banner"
      />

      {/* Password Section */}
      <div className="card">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Password</h2>
          {!isEditingPassword && (
            <button
              type="button"
              onClick={handleEditPassword}
              className="btn-secondary"
            >
              Change Password
            </button>
          )}
        </div>

        {isEditingPassword ? (
          <form onSubmit={handleSavePassword} noValidate className="mt-4 space-y-4">
            {/* Form-level error */}
            {formErrors.form && (
              <div
                role="alert"
                className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {formErrors.form}
              </div>
            )}

            {/* Current Password */}
            <div>
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <input
                id="oldPassword"
                name="oldPassword"
                type="password"
                autoComplete="current-password"
                required
                value={passwordValues.oldPassword || ''}
                onChange={handlePasswordInputChange}
                aria-invalid={formErrors.oldPassword ? 'true' : 'false'}
                aria-describedby={formErrors.oldPassword ? 'oldPassword-error' : undefined}
                className={getInputClasses('oldPassword')}
                placeholder="Enter your current password"
              />
              {formErrors.oldPassword && (
                <p id="oldPassword-error" className="mt-1 text-xs text-red-600" role="alert">
                  {formErrors.oldPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                value={passwordValues.newPassword || ''}
                onChange={handlePasswordInputChange}
                aria-invalid={formErrors.newPassword ? 'true' : 'false'}
                aria-describedby={formErrors.newPassword ? 'newPassword-error' : undefined}
                className={getInputClasses('newPassword')}
                placeholder="Enter a new password"
              />
              {formErrors.newPassword && (
                <p id="newPassword-error" className="mt-1 text-xs text-red-600" role="alert">
                  {formErrors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={passwordValues.confirmPassword || ''}
                onChange={handlePasswordInputChange}
                aria-invalid={formErrors.confirmPassword ? 'true' : 'false'}
                aria-describedby={formErrors.confirmPassword ? 'confirmPassword-error' : undefined}
                className={getInputClasses('confirmPassword')}
                placeholder="Confirm your new password"
              />
              {formErrors.confirmPassword && (
                <p id="confirmPassword-error" className="mt-1 text-xs text-red-600" role="alert">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password Hint */}
            <div>
              <label
                htmlFor="passwordHint"
                className="block text-sm font-medium text-gray-700"
              >
                Password Hint <span className="text-gray-400">(optional)</span>
              </label>
              <input
                id="passwordHint"
                name="passwordHint"
                type="text"
                autoComplete="off"
                value={passwordValues.passwordHint || ''}
                onChange={handlePasswordInputChange}
                aria-invalid={formErrors.passwordHint ? 'true' : 'false'}
                aria-describedby={formErrors.passwordHint ? 'passwordHint-error' : undefined}
                className={getInputClasses('passwordHint')}
                placeholder="Enter a password hint"
              />
              {formErrors.passwordHint && (
                <p id="passwordHint-error" className="mt-1 text-xs text-red-600" role="alert">
                  {formErrors.passwordHint}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancelPassword}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Update Password
              </button>
            </div>
          </form>
        ) : (
          <dl className="mt-4 divide-y divide-gray-100">
            {renderInfoRow('Password Hint', privacySettings.passwordHint)}
            {renderInfoRow('Last Password Change', privacySettings.lastPasswordChange)}
          </dl>
        )}
      </div>

      {/* Security Questions Section */}
      <div className="card">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Security Questions</h2>
          {!isEditingQuestions && (
            <button
              type="button"
              onClick={handleEditQuestions}
              className="btn-secondary"
            >
              Edit
            </button>
          )}
        </div>

        {isEditingQuestions ? (
          <form onSubmit={handleSaveQuestions} noValidate className="mt-4 space-y-6">
            {/* Form-level error */}
            {formErrors.form && (
              <div
                role="alert"
                className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {formErrors.form}
              </div>
            )}

            {questionsValues.map((q, index) => (
              <div key={index} className="space-y-3 rounded-lg border border-gray-200 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Question {index + 1}
                </p>

                {/* Question */}
                <div>
                  <label
                    htmlFor={`security-question-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Question
                  </label>
                  <input
                    id={`security-question-${index}`}
                    type="text"
                    autoComplete="off"
                    required
                    value={q.question || ''}
                    onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                    aria-invalid={formErrors[`question_${index}`] ? 'true' : 'false'}
                    aria-describedby={formErrors[`question_${index}`] ? `question-${index}-error` : undefined}
                    className={getInputClasses(`question_${index}`)}
                    placeholder="Enter your security question"
                  />
                  {formErrors[`question_${index}`] && (
                    <p id={`question-${index}-error`} className="mt-1 text-xs text-red-600" role="alert">
                      {formErrors[`question_${index}`]}
                    </p>
                  )}
                </div>

                {/* Answer */}
                <div>
                  <label
                    htmlFor={`security-answer-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Answer
                  </label>
                  <input
                    id={`security-answer-${index}`}
                    type="text"
                    autoComplete="off"
                    required
                    value={q.answer || ''}
                    onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                    aria-invalid={formErrors[`answer_${index}`] ? 'true' : 'false'}
                    aria-describedby={formErrors[`answer_${index}`] ? `answer-${index}-error` : undefined}
                    className={getInputClasses(`answer_${index}`)}
                    placeholder="Enter your answer"
                  />
                  {formErrors[`answer_${index}`] && (
                    <p id={`answer-${index}-error`} className="mt-1 text-xs text-red-600" role="alert">
                      {formErrors[`answer_${index}`]}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancelQuestions}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Save Questions
              </button>
            </div>
          </form>
        ) : (
          <dl className="mt-4 divide-y divide-gray-100">
            {privacySettings.securityQuestions && privacySettings.securityQuestions.length > 0 ? (
              privacySettings.securityQuestions.map((q, index) => (
                <div key={index} className="py-3">
                  <dt className="text-sm font-medium text-gray-500">Question {index + 1}</dt>
                  <dd className="mt-1 text-sm text-gray-900">{q.question}</dd>
                  <dd className="mt-0.5 text-sm text-gray-500">
                    Answer: {'•'.repeat(q.answer ? q.answer.length : 6)}
                  </dd>
                </div>
              ))
            ) : (
              <div className="py-3">
                <p className="text-sm text-gray-500">No security questions configured.</p>
              </div>
            )}
          </dl>
        )}
      </div>

      {/* Privacy Preferences Section */}
      <div className="card">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Privacy Preferences</h2>
          {!isEditingToggles && (
            <button
              type="button"
              onClick={handleEditToggles}
              className="btn-secondary"
            >
              Edit
            </button>
          )}
        </div>

        {isEditingToggles ? (
          <form onSubmit={handleSaveToggles} noValidate className="mt-4 space-y-4">
            {/* Form-level error */}
            {formErrors.form && (
              <div
                role="alert"
                className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {formErrors.form}
              </div>
            )}

            {/* Two-Factor Authentication */}
            <label className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="mt-0.5 text-xs text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <input
                type="checkbox"
                checked={toggleValues.twoFactorEnabled || false}
                onChange={() => handleToggleChange('twoFactorEnabled')}
                className="h-4 w-4 rounded border-gray-300 text-csnp-600 focus:ring-csnp-500"
                aria-label="Two-Factor Authentication"
              />
            </label>

            {/* HIPAA Authorizations */}
            <label className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-900">HIPAA Authorizations on File</p>
                <p className="mt-0.5 text-xs text-gray-500">Authorize the release of your health information</p>
              </div>
              <input
                type="checkbox"
                checked={toggleValues.hipaaAuthorizationsOnFile || false}
                onChange={() => handleToggleChange('hipaaAuthorizationsOnFile')}
                className="h-4 w-4 rounded border-gray-300 text-csnp-600 focus:ring-csnp-500"
                aria-label="HIPAA Authorizations on File"
              />
            </label>

            {/* Share Data with Providers */}
            <label className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-900">Share Data with Providers</p>
                <p className="mt-0.5 text-xs text-gray-500">Allow your health plan data to be shared with your providers</p>
              </div>
              <input
                type="checkbox"
                checked={toggleValues.shareDataWithProviders || false}
                onChange={() => handleToggleChange('shareDataWithProviders')}
                className="h-4 w-4 rounded border-gray-300 text-csnp-600 focus:ring-csnp-500"
                aria-label="Share Data with Providers"
              />
            </label>

            {/* Allow Research Use */}
            <label className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-900">Allow Research Use</p>
                <p className="mt-0.5 text-xs text-gray-500">Allow de-identified data to be used for research purposes</p>
              </div>
              <input
                type="checkbox"
                checked={toggleValues.allowResearchUse || false}
                onChange={() => handleToggleChange('allowResearchUse')}
                className="h-4 w-4 rounded border-gray-300 text-csnp-600 focus:ring-csnp-500"
                aria-label="Allow Research Use"
              />
            </label>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancelToggles}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Save Preferences
              </button>
            </div>
          </form>
        ) : (
          <dl className="mt-4 divide-y divide-gray-100">
            {renderToggleRow('Two-Factor Authentication', privacySettings.twoFactorEnabled)}
            {renderToggleRow('HIPAA Authorizations on File', privacySettings.hipaaAuthorizationsOnFile)}
            {renderToggleRow('Share Data with Providers', privacySettings.shareDataWithProviders)}
            {renderToggleRow('Allow Research Use', privacySettings.allowResearchUse)}
          </dl>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal
          title="Changes Saved"
          message={confirmationMessage}
          variant="success"
          confirmLabel="OK"
          showCancel={false}
          onConfirm={handleCloseConfirmation}
        />
      )}
    </div>
  );
}