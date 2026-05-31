import { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { defaultDoctorList } from '../../data/mockData.js';
import { SimulationHint } from '../shared/SimulationHint.jsx';

/**
 * Mock Doctor/Hospital Finder UI component for the CSNP Member Portal.
 * Displays a searchable list of fake doctors from mockData.defaultDoctorList.
 * Supports filtering by name/specialty. Each doctor card shows name, specialty,
 * address, phone. User can select a doctor to return to PCP change flow.
 * Shows SimulationHint indicating SSO is not supported and finder is simulated.
 * Accessible search input and selectable list.
 *
 * @param {Object} props
 * @param {function} [props.onSelectDoctor] - Callback invoked when a doctor is selected. Receives the doctor object.
 * @param {function} [props.onCancel] - Callback invoked when the user cancels the finder.
 * @returns {React.ReactElement} The DoctorHospitalFinder component.
 */
export function DoctorHospitalFinder({ onSelectDoctor, onCancel }) {
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Handles search input change.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  /**
   * Filters the doctor list based on the search query.
   * Matches against name and specialty (case-insensitive).
   */
  const filteredDoctors = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();

    if (trimmed.length === 0) {
      return defaultDoctorList;
    }

    return defaultDoctorList.filter((doctor) => {
      const nameMatch = doctor.name && doctor.name.toLowerCase().includes(trimmed);
      const specialtyMatch = doctor.specialty && doctor.specialty.toLowerCase().includes(trimmed);
      return nameMatch || specialtyMatch;
    });
  }, [searchQuery]);

  /**
   * Handles selecting a doctor from the list.
   *
   * @param {Object} doctor - The selected doctor object.
   */
  const handleSelect = useCallback(
    (doctor) => {
      if (onSelectDoctor) {
        onSelectDoctor(doctor);
      }
    },
    [onSelectDoctor]
  );

  /**
   * Handles cancel action.
   */
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900">
          Doctor &amp; Hospital Finder
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Search for an in-network provider by name or specialty.
        </p>
      </div>

      {/* Simulation Hint */}
      <SimulationHint
        message="This is a simulated provider finder. SSO is not supported. All provider data shown is fictitious and for demonstration purposes only."
        variant="banner"
      />

      {/* Search Input */}
      <div>
        <label
          htmlFor="doctor-search"
          className="block text-sm font-medium text-gray-700"
        >
          Search by Name or Specialty
        </label>
        <input
          id="doctor-search"
          name="doctor-search"
          type="search"
          autoComplete="off"
          value={searchQuery}
          onChange={handleSearchChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-csnp-500 focus:ring-csnp-500"
          placeholder="e.g., Cardiology, Dr. Chen"
          aria-label="Search doctors by name or specialty"
        />
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500" aria-live="polite">
        {filteredDoctors.length === 0
          ? 'No providers found matching your search.'
          : `Showing ${filteredDoctors.length} provider${filteredDoctors.length !== 1 ? 's' : ''}`}
      </p>

      {/* Doctor List */}
      <div className="space-y-4" role="list" aria-label="Provider search results">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            role="listitem"
            className="card flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
          >
            {/* Doctor Info */}
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-semibold text-gray-900">{doctor.name}</h3>
              <p className="text-sm text-gray-600">{doctor.specialty}</p>
              <p className="text-sm text-gray-500">{doctor.address}</p>
              <p className="text-sm text-gray-500">{doctor.phone}</p>

              {/* Additional Details */}
              <div className="mt-2 flex flex-wrap gap-2">
                {/* Network Status */}
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    doctor.networkStatus === 'In-Network'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {doctor.networkStatus}
                </span>

                {/* Accepting New Patients */}
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    doctor.acceptingNewPatients
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {doctor.acceptingNewPatients ? 'Accepting New Patients' : 'Not Accepting New Patients'}
                </span>

                {/* Distance */}
                {doctor.distance && (
                  <span className="inline-flex items-center rounded-full bg-csnp-50 px-2.5 py-0.5 text-xs font-medium text-csnp-700">
                    {doctor.distance}
                  </span>
                )}

                {/* Rating */}
                {doctor.rating && (
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                    ★ {doctor.rating}
                  </span>
                )}
              </div>

              {/* Languages */}
              {doctor.languages && doctor.languages.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {doctor.languages.map((lang) => (
                    <span
                      key={lang}
                      className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs text-gray-600"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Select Button */}
            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={() => handleSelect(doctor)}
                className="btn-primary"
                aria-label={`Select ${doctor.name}`}
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Button */}
      {onCancel && (
        <div className="flex justify-end border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

DoctorHospitalFinder.propTypes = {
  onSelectDoctor: PropTypes.func,
  onCancel: PropTypes.func,
};

export default DoctorHospitalFinder;