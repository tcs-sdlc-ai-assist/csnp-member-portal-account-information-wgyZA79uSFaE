import { useState, useCallback } from 'react';
import {
  getRepresentatives,
  addRepresentative,
  editRepresentative,
  removeRepresentative,
} from '../../services/mockRepository.js';
import { SimulationHint } from '../shared/SimulationHint.jsx';
import { ConfirmationModal } from '../shared/ConfirmationModal.jsx';
import { SIMULATION_HINT_TEXT } from '../../utils/constants.js';

/**
 * Available permission options for representatives.
 * @type {string[]}
 */
const PERMISSION_OPTIONS = [
  'View Claims',
  'Speak on Behalf',
  'Receive Mail',
  'Schedule Appointments',
  'Access Medical Records',
];

/**
 * Available relationship options for representatives.
 * @type {string[]}
 */
const RELATIONSHIP_OPTIONS = [
  'Spouse',
  'Son',
  'Daughter',
  'Parent',
  'Sibling',
  'Legal Guardian',
  'Power of Attorney',
  'Other',
];

/**
 * Representatives management component for the CSNP Member Portal.
 * Displays list of authorized representatives from mockRepository in a card layout.
 * Supports add (modal form), edit (modal), and remove (with confirmation modal).
 * On each action, updates mockRepository and shows confirmation.
 * Shows SimulationHint. Accessible table with proper headers and action buttons.
 *
 * @returns {React.ReactElement} The Representatives component.
 */
export default function Representatives() {
  const [representatives, setRepresentatives] = useState(() => getRepresentatives());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRep, setEditingRep] = useState(null);
  const [removingRep, setRemovingRep] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});

  /**
   * Returns initial empty form values for add/edit modal.
   * @returns {Object} Empty form values.
   */
  const getEmptyFormValues = useCallback(() => ({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    permissions: [],
  }), []);

  /**
   * Opens the add representative modal with empty form.
   */
  const handleOpenAdd = useCallback(() => {
    setFormValues(getEmptyFormValues());
    setFormErrors({});
    setShowAddModal(true);
  }, [getEmptyFormValues]);

  /**
   * Closes the add representative modal.
   */
  const handleCloseAdd = useCallback(() => {
    setShowAddModal(false);
    setFormValues({});
    setFormErrors({});
  }, []);

  /**
   * Opens the edit modal for a specific representative.
   * @param {Object} rep - The representative to edit.
   */
  const handleOpenEdit = useCallback((rep) => {
    setFormValues({
      name: rep.name || '',
      relationship: rep.relationship || '',
      phone: rep.phone || '',
      email: rep.email || '',
      permissions: rep.permissions ? [...rep.permissions] : [],
    });
    setFormErrors({});
    setEditingRep(rep);
  }, []);

  /**
   * Closes the edit modal.
   */
  const handleCloseEdit = useCallback(() => {
    setEditingRep(null);
    setFormValues({});
    setFormErrors({});
  }, []);

  /**
   * Opens the remove confirmation modal for a specific representative.
   * @param {Object} rep - The representative to remove.
   */
  const handleOpenRemove = useCallback((rep) => {
    setRemovingRep(rep);
  }, []);

  /**
   * Closes the remove confirmation modal.
   */
  const handleCloseRemove = useCallback(() => {
    setRemovingRep(null);
  }, []);

  /**
   * Handles input change for form fields.
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} event - The input change event.
   */
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      delete next.form;
      return next;
    });
  }, []);

  /**
   * Handles permission checkbox toggle.
   * @param {string} permission - The permission to toggle.
   */
  const handlePermissionToggle = useCallback((permission) => {
    setFormValues((prev) => {
      const current = prev.permissions || [];
      const updated = current.includes(permission)
        ? current.filter((p) => p !== permission)
        : [...current, permission];
      return { ...prev, permissions: updated };
    });
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next.form;
      return next;
    });
  }, []);

  /**
   * Validates the representative form fields.
   * @returns {{ valid: boolean, errors: Object }} Validation result.
   */
  const validateForm = useCallback(() => {
    const errors = {};

    if (!formValues.name || typeof formValues.name !== 'string' || formValues.name.trim().length === 0) {
      errors.name = 'Name is required';
    }

    if (!formValues.relationship || typeof formValues.relationship !== 'string' || formValues.relationship.trim().length === 0) {
      errors.relationship = 'Relationship is required';
    }

    if (!formValues.phone || typeof formValues.phone !== 'string' || formValues.phone.trim().length === 0) {
      errors.phone = 'Phone number is required';
    }

    if (formValues.email && typeof formValues.email === 'string' && formValues.email.trim().length > 0) {
      const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
      if (!emailRegex.test(formValues.email.trim())) {
        errors.email = 'Please enter a valid email address';
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }, [formValues]);

  /**
   * Handles adding a new representative.
   * @param {React.FormEvent} event - The form submit event.
   */
  const handleAddSubmit = useCallback(
    (event) => {
      event.preventDefault();
      setFormErrors({});

      const validation = validateForm();

      if (!validation.valid) {
        setFormErrors(validation.errors);
        return;
      }

      const newRep = {
        name: formValues.name.trim(),
        relationship: formValues.relationship.trim(),
        phone: formValues.phone.trim(),
        email: formValues.email ? formValues.email.trim() : '',
        permissions: formValues.permissions || [],
      };

      const result = addRepresentative(newRep);

      if (result.success) {
        setRepresentatives(result.representatives);
        setShowAddModal(false);
        setFormValues({});
        setConfirmationMessage('Representative has been added successfully.');
        setShowConfirmation(true);
      } else {
        setFormErrors({ form: result.error || 'Failed to add representative. Please try again.' });
      }
    },
    [formValues, validateForm]
  );

  /**
   * Handles editing an existing representative.
   * @param {React.FormEvent} event - The form submit event.
   */
  const handleEditSubmit = useCallback(
    (event) => {
      event.preventDefault();
      setFormErrors({});

      const validation = validateForm();

      if (!validation.valid) {
        setFormErrors(validation.errors);
        return;
      }

      const updatedFields = {
        name: formValues.name.trim(),
        relationship: formValues.relationship.trim(),
        phone: formValues.phone.trim(),
        email: formValues.email ? formValues.email.trim() : '',
        permissions: formValues.permissions || [],
      };

      const result = editRepresentative(editingRep.id, updatedFields);

      if (result.success) {
        setRepresentatives(result.representatives);
        setEditingRep(null);
        setFormValues({});
        setConfirmationMessage('Representative has been updated successfully.');
        setShowConfirmation(true);
      } else {
        setFormErrors({ form: result.error || 'Failed to update representative. Please try again.' });
      }
    },
    [formValues, editingRep, validateForm]
  );

  /**
   * Handles removing a representative after confirmation.
   */
  const handleConfirmRemove = useCallback(() => {
    if (!removingRep) {
      return;
    }

    const result = removeRepresentative(removingRep.id);

    if (result.success) {
      setRepresentatives(result.representatives);
      setRemovingRep(null);
      setConfirmationMessage('Representative has been removed successfully.');
      setShowConfirmation(true);
    } else {
      setRemovingRep(null);
      setConfirmationMessage(result.error || 'Failed to remove representative.');
      setShowConfirmation(true);
    }
  }, [removingRep]);

  /**
   * Closes the success confirmation modal.
   */
  const handleCloseConfirmation = useCallback(() => {
    setShowConfirmation(false);
    setConfirmationMessage('');
  }, []);

  /**
   * Returns the appropriate input CSS classes based on error state.
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
   * Renders the representative form fields used in both add and edit modals.
   * @param {function} onSubmit - The form submit handler.
   * @param {string} submitLabel - The label for the submit button.
   * @param {function} onCancel - The cancel handler.
   * @returns {React.ReactElement} The form element.
   */
  const renderForm = (onSubmit, submitLabel, onCancel) => (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {/* Form-level error */}
      {formErrors.form && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {formErrors.form}
        </div>
      )}

      {/* Name */}
      <div>
        <label
          htmlFor="rep-name"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>
        <input
          id="rep-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={formValues.name || ''}
          onChange={handleInputChange}
          aria-invalid={formErrors.name ? 'true' : 'false'}
          aria-describedby={formErrors.name ? 'rep-name-error' : undefined}
          className={getInputClasses('name')}
          placeholder="Enter full name"
        />
        {formErrors.name && (
          <p id="rep-name-error" className="mt-1 text-xs text-red-600" role="alert">
            {formErrors.name}
          </p>
        )}
      </div>

      {/* Relationship */}
      <div>
        <label
          htmlFor="rep-relationship"
          className="block text-sm font-medium text-gray-700"
        >
          Relationship
        </label>
        <select
          id="rep-relationship"
          name="relationship"
          required
          value={formValues.relationship || ''}
          onChange={handleInputChange}
          aria-invalid={formErrors.relationship ? 'true' : 'false'}
          aria-describedby={formErrors.relationship ? 'rep-relationship-error' : undefined}
          className={getInputClasses('relationship')}
        >
          <option value="">Select relationship</option>
          {RELATIONSHIP_OPTIONS.map((rel) => (
            <option key={rel} value={rel}>
              {rel}
            </option>
          ))}
        </select>
        {formErrors.relationship && (
          <p id="rep-relationship-error" className="mt-1 text-xs text-red-600" role="alert">
            {formErrors.relationship}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="rep-phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <input
          id="rep-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          value={formValues.phone || ''}
          onChange={handleInputChange}
          aria-invalid={formErrors.phone ? 'true' : 'false'}
          aria-describedby={formErrors.phone ? 'rep-phone-error' : undefined}
          className={getInputClasses('phone')}
          placeholder="Enter phone number"
        />
        {formErrors.phone && (
          <p id="rep-phone-error" className="mt-1 text-xs text-red-600" role="alert">
            {formErrors.phone}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="rep-email"
          className="block text-sm font-medium text-gray-700"
        >
          Email Address <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="rep-email"
          name="email"
          type="email"
          autoComplete="email"
          value={formValues.email || ''}
          onChange={handleInputChange}
          aria-invalid={formErrors.email ? 'true' : 'false'}
          aria-describedby={formErrors.email ? 'rep-email-error' : undefined}
          className={getInputClasses('email')}
          placeholder="Enter email address"
        />
        {formErrors.email && (
          <p id="rep-email-error" className="mt-1 text-xs text-red-600" role="alert">
            {formErrors.email}
          </p>
        )}
      </div>

      {/* Permissions */}
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700">
          Permissions
        </legend>
        <div className="mt-2 space-y-2">
          {PERMISSION_OPTIONS.map((permission) => (
            <label
              key={permission}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={(formValues.permissions || []).includes(permission)}
                onChange={() => handlePermissionToggle(permission)}
                className="h-4 w-4 rounded border-gray-300 text-csnp-600 focus:ring-csnp-500"
              />
              {permission}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );

  /**
   * Renders a modal overlay with title and content.
   * @param {string} title - The modal title.
   * @param {React.ReactNode} children - The modal content.
   * @param {function} onClose - The close handler.
   * @returns {React.ReactElement} The modal element.
   */
  const renderModal = (title, children, onClose) => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 transition-opacity"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rep-modal-title"
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <h2
          id="rep-modal-title"
          className="mb-4 text-lg font-semibold text-gray-900"
        >
          {title}
        </h2>
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Authorized Representatives</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage the people authorized to act on your behalf regarding your health plan.
        </p>
      </div>

      {/* Simulation Hint */}
      <SimulationHint
        message={SIMULATION_HINT_TEXT.representatives}
        variant="banner"
      />

      {/* Representatives Card */}
      <div className="card">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Representatives</h2>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="btn-primary"
          >
            Add Representative
          </button>
        </div>

        {representatives.length === 0 ? (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              No authorized representatives have been added yet.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="btn-secondary mt-4"
            >
              Add Your First Representative
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="mt-4 hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm" role="table">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th scope="col" className="pb-3 pr-4 font-medium text-gray-500">Name</th>
                    <th scope="col" className="pb-3 pr-4 font-medium text-gray-500">Relationship</th>
                    <th scope="col" className="pb-3 pr-4 font-medium text-gray-500">Phone</th>
                    <th scope="col" className="pb-3 pr-4 font-medium text-gray-500">Email</th>
                    <th scope="col" className="pb-3 pr-4 font-medium text-gray-500">Authorized Date</th>
                    <th scope="col" className="pb-3 pr-4 font-medium text-gray-500">Permissions</th>
                    <th scope="col" className="pb-3 font-medium text-gray-500">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {representatives.map((rep) => (
                    <tr key={rep.id}>
                      <td className="py-3 pr-4 font-medium text-gray-900">{rep.name}</td>
                      <td className="py-3 pr-4 text-gray-700">{rep.relationship}</td>
                      <td className="py-3 pr-4 text-gray-700">{rep.phone}</td>
                      <td className="py-3 pr-4 text-gray-700">{rep.email || '—'}</td>
                      <td className="py-3 pr-4 text-gray-700">{rep.authorizedDate || '—'}</td>
                      <td className="py-3 pr-4 text-gray-700">
                        {rep.permissions && rep.permissions.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {rep.permissions.map((perm) => (
                              <span
                                key={perm}
                                className="inline-flex items-center rounded-full bg-csnp-50 px-2 py-0.5 text-xs font-medium text-csnp-700"
                              >
                                {perm}
                              </span>
                            ))}
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(rep)}
                            className="text-sm font-medium text-csnp-600 transition-colors hover:text-csnp-500"
                            aria-label={`Edit ${rep.name}`}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenRemove(rep)}
                            className="text-sm font-medium text-red-600 transition-colors hover:text-red-500"
                            aria-label={`Remove ${rep.name}`}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="mt-4 space-y-4 sm:hidden">
              {representatives.map((rep) => (
                <div
                  key={rep.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{rep.name}</p>
                      <p className="mt-0.5 text-sm text-gray-500">{rep.relationship}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(rep)}
                        className="text-sm font-medium text-csnp-600 transition-colors hover:text-csnp-500"
                        aria-label={`Edit ${rep.name}`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenRemove(rep)}
                        className="text-sm font-medium text-red-600 transition-colors hover:text-red-500"
                        aria-label={`Remove ${rep.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <dl className="mt-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Phone</dt>
                      <dd className="text-gray-700">{rep.phone}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Email</dt>
                      <dd className="text-gray-700">{rep.email || '—'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Authorized</dt>
                      <dd className="text-gray-700">{rep.authorizedDate || '—'}</dd>
                    </div>
                  </dl>
                  {rep.permissions && rep.permissions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {rep.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="inline-flex items-center rounded-full bg-csnp-50 px-2 py-0.5 text-xs font-medium text-csnp-700"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Representative Modal */}
      {showAddModal &&
        renderModal(
          'Add Representative',
          renderForm(handleAddSubmit, 'Add Representative', handleCloseAdd),
          handleCloseAdd
        )}

      {/* Edit Representative Modal */}
      {editingRep &&
        renderModal(
          'Edit Representative',
          renderForm(handleEditSubmit, 'Save Changes', handleCloseEdit),
          handleCloseEdit
        )}

      {/* Remove Confirmation Modal */}
      {removingRep && (
        <ConfirmationModal
          title="Remove Representative"
          message={`Are you sure you want to remove ${removingRep.name} as an authorized representative? This action cannot be undone.`}
          variant="warning"
          confirmLabel="Remove"
          cancelLabel="Cancel"
          showCancel={true}
          onConfirm={handleConfirmRemove}
          onCancel={handleCloseRemove}
        />
      )}

      {/* Success Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal
          title="Success"
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