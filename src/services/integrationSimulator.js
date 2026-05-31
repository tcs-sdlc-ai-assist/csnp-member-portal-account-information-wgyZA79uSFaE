/**
 * Simulated external integration adapter for the CSNP Member Portal.
 * Provides mock implementations of API calls, CDM sync, and Ncompass lookup.
 * All responses are static mock data with simulated delays. No real network calls.
 * @module integrationSimulator
 */

import { safeLog, maskObject } from '../utils/piiMasker.js';
import { formatDate, getRelativeDate } from '../utils/dateReference.js';

/**
 * Default simulated delay in milliseconds for mock async operations.
 * @type {number}
 */
const DEFAULT_DELAY_MS = 800;

/**
 * Static mock API responses keyed by endpoint path.
 * @type {Object.<string, Object>}
 */
const MOCK_API_RESPONSES = {
  '/members/profile': {
    status: 200,
    data: {
      memberId: 'CSNP8834721',
      firstName: 'Jane',
      lastName: 'Doe',
      planName: 'CSNP Premier Gold',
      planId: 'CSNP-PG-2024',
      effectiveDate: formatDate(getRelativeDate(-180), 'YYYY-MM-DD'),
      status: 'Active',
    },
  },
  '/members/eligibility': {
    status: 200,
    data: {
      eligible: true,
      planType: 'C-SNP',
      effectiveDate: formatDate(getRelativeDate(-180), 'YYYY-MM-DD'),
      terminationDate: null,
      chronicConditions: ['Diabetes', 'Cardiovascular'],
      vccAttestationStatus: 'Completed',
    },
  },
  '/claims/summary': {
    status: 200,
    data: {
      totalClaims: 12,
      pendingClaims: 2,
      approvedClaims: 9,
      deniedClaims: 1,
      lastClaimDate: formatDate(getRelativeDate(-5), 'YYYY-MM-DD'),
    },
  },
  '/authorizations/status': {
    status: 200,
    data: {
      activeAuthorizations: 3,
      pendingAuthorizations: 1,
      lastUpdated: formatDate(getRelativeDate(-2), 'YYYY-MM-DD'),
    },
  },
  '/pharmacy/prescriptions': {
    status: 200,
    data: {
      activePrescriptions: 4,
      pendingRefills: 1,
      lastFillDate: formatDate(getRelativeDate(-10), 'YYYY-MM-DD'),
      pharmacyName: 'Springfield Community Pharmacy',
    },
  },
};

/**
 * Default mock API response for unrecognized endpoints.
 * @type {Object}
 */
const DEFAULT_API_RESPONSE = {
  status: 200,
  data: {
    message: 'Simulated response',
    timestamp: formatDate(getRelativeDate(0), 'YYYY-MM-DD'),
  },
};

/**
 * Simulates an asynchronous delay.
 *
 * @param {number} [ms=DEFAULT_DELAY_MS] - The delay duration in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
function delay(ms = DEFAULT_DELAY_MS) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Simulates an API call to the specified endpoint with optional request data.
 * Returns a static mock response after a simulated delay. No real network calls are made.
 *
 * @param {string} endpoint - The API endpoint path (e.g., '/members/profile').
 * @param {Object} [data={}] - Optional request data to include in the simulated call.
 * @returns {Promise<{ success: boolean, status: number, data?: Object, error?: string, endpoint: string, simulatedAt: string }>} The simulated API response.
 *
 * @example
 * const result = await simulateAPICall('/members/profile');
 * // { success: true, status: 200, data: { memberId: 'CSNP8834721', ... }, endpoint: '/members/profile', simulatedAt: '2024-06-10' }
 *
 * @example
 * const result = await simulateAPICall('/unknown/endpoint');
 * // { success: true, status: 200, data: { message: 'Simulated response', ... }, endpoint: '/unknown/endpoint', simulatedAt: '2024-06-10' }
 */
export async function simulateAPICall(endpoint, data = {}) {
  try {
    safeLog('IntegrationSimulator', {
      message: 'Simulating API call',
      endpoint,
      requestData: data,
    });

    await delay();

    const mockResponse = MOCK_API_RESPONSES[endpoint] || DEFAULT_API_RESPONSE;

    const result = {
      success: true,
      status: mockResponse.status,
      data: { ...mockResponse.data },
      endpoint,
      simulatedAt: formatDate(getRelativeDate(0), 'YYYY-MM-DD'),
    };

    safeLog('IntegrationSimulator', {
      message: 'API call simulated successfully',
      endpoint,
      status: result.status,
    });

    return result;
  } catch (_err) {
    safeLog('IntegrationSimulator', {
      message: 'Simulated API call failed',
      endpoint,
    });

    return {
      success: false,
      status: 500,
      error: 'Simulated API call encountered an unexpected error',
      endpoint,
      simulatedAt: formatDate(getRelativeDate(0), 'YYYY-MM-DD'),
    };
  }
}

/**
 * Simulates a CDM (Clinical Data Management) synchronization operation.
 * Returns a static mock sync result after a simulated delay. No real data sync occurs.
 *
 * @param {Object} [data={}] - The data payload to simulate syncing.
 * @returns {Promise<{ success: boolean, syncId: string, recordsSynced: number, syncTimestamp: string, source: string, status: string, details: Object }>} The simulated CDM sync result.
 *
 * @example
 * const result = await simulateCDMSync({ memberId: 'CSNP8834721' });
 * // { success: true, syncId: 'CDM-SYNC-...', recordsSynced: 7, ... }
 */
export async function simulateCDMSync(data = {}) {
  try {
    safeLog('IntegrationSimulator', {
      message: 'Simulating CDM sync',
      requestData: data,
    });

    await delay(1200);

    const maskedData = maskObject(data);

    const result = {
      success: true,
      syncId: 'CDM-SYNC-' + Date.now().toString(36).toUpperCase(),
      recordsSynced: 7,
      syncTimestamp: formatDate(getRelativeDate(0), 'YYYY-MM-DD'),
      source: 'CDM',
      status: 'Completed',
      details: {
        memberRecords: 1,
        claimRecords: 3,
        authorizationRecords: 2,
        pharmacyRecords: 1,
        lastSyncDate: formatDate(getRelativeDate(-1), 'YYYY-MM-DD'),
        inputDataReceived: maskedData,
      },
    };

    safeLog('IntegrationSimulator', {
      message: 'CDM sync simulated successfully',
      syncId: result.syncId,
      recordsSynced: result.recordsSynced,
    });

    return result;
  } catch (_err) {
    safeLog('IntegrationSimulator', {
      message: 'Simulated CDM sync failed',
    });

    return {
      success: false,
      syncId: null,
      recordsSynced: 0,
      syncTimestamp: formatDate(getRelativeDate(0), 'YYYY-MM-DD'),
      source: 'CDM',
      status: 'Failed',
      details: {
        error: 'Simulated CDM sync encountered an unexpected error',
      },
    };
  }
}

/**
 * Simulates an Ncompass system lookup query.
 * Returns static mock lookup results after a simulated delay. No real system query occurs.
 *
 * @param {string} [query=''] - The search query string for the Ncompass lookup.
 * @returns {Promise<{ success: boolean, query: string, resultCount: number, results: Array<Object>, lookupTimestamp: string, source: string }>} The simulated Ncompass lookup result.
 *
 * @example
 * const result = await simulateNcompassLookup('Jane Doe');
 * // { success: true, query: 'Jane Doe', resultCount: 3, results: [...], ... }
 *
 * @example
 * const result = await simulateNcompassLookup('');
 * // { success: true, query: '', resultCount: 0, results: [], ... }
 */
export async function simulateNcompassLookup(query = '') {
  try {
    safeLog('IntegrationSimulator', {
      message: 'Simulating Ncompass lookup',
      query,
    });

    await delay(600);

    const trimmedQuery = typeof query === 'string' ? query.trim() : '';

    if (trimmedQuery.length === 0) {
      const emptyResult = {
        success: true,
        query: trimmedQuery,
        resultCount: 0,
        results: [],
        lookupTimestamp: formatDate(getRelativeDate(0), 'YYYY-MM-DD'),
        source: 'Ncompass',
      };

      safeLog('IntegrationSimulator', {
        message: 'Ncompass lookup returned empty results (no query provided)',
      });

      return emptyResult;
    }

    const mockResults = [
      {
        id: 'NC-001',
        memberId: 'CSNP8834721',
        name: 'Jane Doe',
        planName: 'CSNP Premier Gold',
        status: 'Active',
        enrollmentDate: formatDate(getRelativeDate(-180), 'YYYY-MM-DD'),
        chronicConditions: ['Diabetes', 'Cardiovascular'],
      },
      {
        id: 'NC-002',
        referenceId: 'REF-44821',
        type: 'Authorization',
        status: 'Approved',
        serviceDate: formatDate(getRelativeDate(-15), 'YYYY-MM-DD'),
        provider: 'Dr. Robert Chen',
        description: 'Specialist referral - Cardiology',
      },
      {
        id: 'NC-003',
        referenceId: 'CLM-77293',
        type: 'Claim',
        status: 'Processed',
        dateOfService: formatDate(getRelativeDate(-20), 'YYYY-MM-DD'),
        provider: 'Springfield Medical Center',
        amount: '$125.00',
        memberResponsibility: '$20.00',
      },
    ];

    const result = {
      success: true,
      query: trimmedQuery,
      resultCount: mockResults.length,
      results: mockResults,
      lookupTimestamp: formatDate(getRelativeDate(0), 'YYYY-MM-DD'),
      source: 'Ncompass',
    };

    safeLog('IntegrationSimulator', {
      message: 'Ncompass lookup simulated successfully',
      query: trimmedQuery,
      resultCount: result.resultCount,
    });

    return result;
  } catch (_err) {
    safeLog('IntegrationSimulator', {
      message: 'Simulated Ncompass lookup failed',
      query,
    });

    return {
      success: false,
      query: typeof query === 'string' ? query.trim() : '',
      resultCount: 0,
      results: [],
      lookupTimestamp: formatDate(getRelativeDate(0), 'YYYY-MM-DD'),
      source: 'Ncompass',
    };
  }
}