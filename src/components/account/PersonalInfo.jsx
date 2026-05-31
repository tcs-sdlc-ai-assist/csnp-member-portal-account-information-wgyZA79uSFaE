import { useState, useCallback } from 'react';
import { getPersonalInfo, updatePersonalInfo } from '../../services/mockRepository.js';
import { SimulationHint } from '../shared/SimulationHint.jsx';
import { ConfirmationModal } from '../shared/ConfirmationModal.jsx';
import { SIMULATION_HINT_TEXT } from '../../utils/constants.js';

/**
 * Personal information management component for the CSNP Member Portal.
 * Displays member's personal info (name, DOB, address, email, phone, member ID)
 * from mockRepository in a card layout. Supports inline editing with save/cancel.
 * On save, calls updatePersonalInfo and shows confirmation.
 * Shows SimulationHint. All data is obviously fake.
 * Accessible form fields with labels and error messages.
 *
 * @returns {React.ReactElement} The PersonalInfo component.
 */
export default function PersonalInfo() {
  const [personalInfo, setPersonalInfo] = useState(() => getPersonalInfo());
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  /**
   * Enters edit mode and populates edit values from current personal info.
   */
  const handleEdit = useCallback(() => {
    setEditValues({
      firstName: personalInfo.firstName || '',
      lastName: personalInfo.lastName || '',
      email: personalInfo.email || '',
      phone: personalInfo.phone || '',
      address: personalInfo.address || '',
    });
    setFormErrors({});
    setIsEditing(true);
  }, [personalInfo]);

  /**
   * Cancels editing and resets form state.
   */
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditValues({});
    setFormErrors({});
  }, []);

  /**
   * Handles input change for editable fields.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[name];
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

    if (!editValues.firstName || typeof editValues.firstName !== 'string' || editValues.firstName.trim().length === 0) {
      errors.firstName = 'First name is required';
    }

    if (!editValues.lastName || typeof editValues.lastName !== 'string' || editValues.lastName.trim().length === 0) {
      errors.lastName = 'Last name is required';
    }

    if (!editValues.email || typeof editValues.email !== 'string' || editValues.email.trim().length === 0) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
      if (!emailRegex.test(editValues.email.trim())) {
        errors.email = 'Please enter a valid email address';
      }
    }

    if (!editValues.phone || typeof editValues.phone !== 'string' || editValues.phone.trim().length === 0) {
      errors.phone = 'Phone number is required';
    }

    if (!editValues.address || typeof editValues.address !== 'string' || editValues.address.trim().length === 0) {
      errors.address = 'Address is required';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }, [editValues]);

  /**
   * Handles form submission for saving personal info changes.
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

      const updatedFields = {
        firstName: editValues.firstName.trim(),
        lastName: editValues.lastName.trim(),
        email: editValues.email.trim(),
        phone: editValues.phone.trim(),
        address: editValues.address.trim(),
      };

      const result = updatePersonalInfo(updatedFields);

      if (result.success) {
        setPersonalInfo(result.personalInfo);
        setIsEditing(false);
        setEditValues({});
        setShowConfirmation(true);
      } else {
        setFormErrors({ form: result.error || 'Failed to update personal information. Please try again.' });
      }
    },
    [editValues, validateForm]
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
   * @param {string} value - The field value.
   * @returns {React.ReactElement} The info row element.
   */
  const renderInfoRow = (label, value) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 py-3 last:border-b-0">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:text-right">{value || '—'}</dd>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Personal Information</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage your personal details and account information.
        </p>
      </div>

      {/* Simulation Hint */}
      <SimulationHint
        message={SIMULATION_HINT_TEXT.personalInfo}
        variant="banner"
      />

      {/* Personal Info Card */}
      <div className="card">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Member Details</h2>
          {!isEditing && (
            <button
              type="button"
              onClick={handleEdit}
              className="btn-secondary"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          /* Edit Mode */
          <form onSubmit={handleSave} noValidate className="mt-4 space-y-4">
            {/* Form-level error */}
            {formErrors.form && (
              <div
                role="alert"
                className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {formErrors.form}
              </div>
            )}

            {/* Read-only fields */}
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                Read-Only Fields
              </p>
              <dl className="space-y-1">
                {renderInfoRow('Member ID', personalInfo.memberId)}
                {renderInfoRow('Date of Birth', personalInfo.dateOfBirth)}
                {renderInfoRow('Plan Name', personalInfo.planName)}
                {renderInfoRow('Plan ID', personalInfo.planId)}
                {renderInfoRow('Effective Date', personalInfo.effectiveDate)}
                {renderInfoRow('Group Number', personalInfo.groupNumber)}
                {renderInfoRow('Preferred Language', personalInfo.preferredLanguage)}
              </dl>
            </div>

            {/* Editable fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* First Name */}
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
                  value={editValues.firstName}
                  onChange={handleInputChange}
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

              {/* Last Name */}
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
                  value={editValues.lastName}
                  onChange={handleInputChange}
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

            {/* Email */}
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
                value={editValues.email}
                onChange={handleInputChange}
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

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={editValues.phone}
                onChange={handleInputChange}
                aria-invalid={formErrors.phone ? 'true' : 'false'}
                aria-describedby={formErrors.phone ? 'phone-error' : undefined}
                className={getInputClasses('phone')}
                placeholder="Enter your phone number"
              />
              {formErrors.phone && (
                <p id="phone-error" className="mt-1 text-xs text-red-600" role="alert">
                  {formErrors.phone}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
                required
                value={editValues.address}
                onChange={handleInputChange}
                aria-invalid={formErrors.address ? 'true' : 'false'}
                aria-describedby={formErrors.address ? 'address-error' : undefined}
                className={getInputClasses('address')}
                placeholder="Enter your address"
              />
              {formErrors.address && (
                <p id="address-error" className="mt-1 text-xs text-red-600" role="alert">
                  {formErrors.address}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <dl className="mt-4 divide-y divide-gray-100">
            {renderInfoRow('First Name', personalInfo.firstName)}
            {renderInfoRow('Last Name', personalInfo.lastName)}
            {renderInfoRow('Date of Birth', personalInfo.dateOfBirth)}
            {renderInfoRow('Member ID', personalInfo.memberId)}
            {renderInfoRow('Email', personalInfo.email)}
            {renderInfoRow('Phone', personalInfo.phone)}
            {renderInfoRow('Address', personalInfo.address)}
            {renderInfoRow('Preferred Language', personalInfo.preferredLanguage)}
            {renderInfoRow('Plan Name', personalInfo.planName)}
            {renderInfoRow('Plan ID', personalInfo.planId)}
            {renderInfoRow('Effective Date', personalInfo.effectiveDate)}
            {renderInfoRow('Group Number', personalInfo.groupNumber)}
          </dl>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal
          title="Changes Saved"
          message="Your personal information has been updated successfully."
          variant="success"
          confirmLabel="OK"
          showCancel={false}
          onConfirm={handleCloseConfirmation}
        />
      )}
    </div>
  );
}