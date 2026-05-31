import { useCareManagerInfo } from '../../contexts/CareManagerContext.jsx';
import { SimulationHint } from '../shared/SimulationHint.jsx';
import { SIMULATION_HINT_TEXT } from '../../utils/constants.js';

/**
 * Care manager information component for the CSNP Member Portal.
 * Displays care manager details (name, contact info, assigned date, department,
 * availability, next scheduled call) from useCareManagerInfo context hook.
 * Read-only display with no editing capability.
 * Shows SimulationHint indicating data is mocked.
 * Accessible card layout with proper headings and labels.
 *
 * @returns {React.ReactElement} The CareManagerInfo component.
 */
export default function CareManagerInfo() {
  const {
    careManagerInfo,
    formattedCareManagerInfo,
    loading,
    error,
  } = useCareManagerInfo();

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Care Manager
          </h1>
          <p className="mt-1 text-sm text-gray-600">Loading your care manager information...</p>
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
          Care Manager
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          View your assigned care manager&apos;s contact information and availability.
        </p>
      </div>

      {/* Simulation Hint */}
      <SimulationHint message={SIMULATION_HINT_TEXT.careManager} variant="banner" />

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Care Manager Details Card */}
      <div className="card">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Care Manager Details</h2>
        </div>

        {careManagerInfo && Object.keys(careManagerInfo).length > 0 ? (
          <dl className="mt-4 divide-y divide-gray-100">
            {renderInfoRow('Name', careManagerInfo.name)}
            {renderInfoRow('Phone', careManagerInfo.phone)}
            {renderInfoRow('Email', careManagerInfo.email)}
            {renderInfoRow('Department', careManagerInfo.department)}
            {renderInfoRow(
              'Assigned Date',
              formattedCareManagerInfo.assignedDateFormatted || careManagerInfo.assignedDate
            )}
            {renderInfoRow('Availability', careManagerInfo.availability)}
            {renderInfoRow(
              'Next Scheduled Call',
              formattedCareManagerInfo.nextScheduledCallFormatted || careManagerInfo.nextScheduledCall
            )}
          </dl>
        ) : (
          <div className="mt-4 text-center py-8">
            <p className="text-sm text-gray-500">
              No care manager information is currently available.
            </p>
          </div>
        )}
      </div>

      {/* Contact Information Card */}
      {careManagerInfo && careManagerInfo.name && (
        <div className="card">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-lg font-semibold text-gray-900">Need to Reach Your Care Manager?</h2>
          </div>
          <div className="mt-4 space-y-3">
            <p className="text-sm text-gray-600">
              You can contact your care manager during their available hours for assistance with care coordination, referrals, or any questions about your health plan.
            </p>
            {careManagerInfo.phone && (
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 flex-shrink-0 text-csnp-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-900">{careManagerInfo.phone}</span>
              </div>
            )}
            {careManagerInfo.email && (
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 flex-shrink-0 text-csnp-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                  />
                  <path
                    d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-900">{careManagerInfo.email}</span>
              </div>
            )}
            {careManagerInfo.availability && (
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 flex-shrink-0 text-csnp-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-900">{careManagerInfo.availability}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}