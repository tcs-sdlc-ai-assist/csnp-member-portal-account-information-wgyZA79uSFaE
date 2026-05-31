/**
 * Application-wide constants for the CSNP Member Portal
 */

/**
 * Reference date used for date calculations throughout the application.
 * Can be overridden via VITE_REFERENCE_DATE environment variable.
 * @type {string}
 */
export const REFERENCE_DATE = import.meta.env.VITE_REFERENCE_DATE || '2024-06-10';

/**
 * Mapping of all localStorage keys used by the application.
 * @type {Object.<string, string>}
 */
export const STORAGE_KEYS = {
  personalInfo: 'csnp_personal_info',
  representatives: 'csnp_representatives',
  privacySettings: 'csnp_privacy_settings',
  communicationPreferences: 'csnp_communication_preferences',
  pcpInfo: 'csnp_pcp_info',
  careManagerInfo: 'csnp_care_manager_info',
  session: 'csnp_session',
};

/**
 * Available notification categories for member communication preferences.
 * @type {string[]}
 */
export const NOTIFICATION_CATEGORIES = [
  'Benefits Updates',
  'Claims & Billing',
  'Appointments & Reminders',
  'Plan Changes',
  'Wellness & Health Tips',
  'Pharmacy & Prescriptions',
  'Authorization Status',
  'General Announcements',
];

/**
 * Available notification delivery methods.
 * @type {string[]}
 */
export const NOTIFICATION_METHODS = [
  'Email',
  'Text Message (SMS)',
  'Phone Call',
  'Mail',
  'Portal Message',
];

/**
 * Reasons a member may request a PCP change.
 * @type {string[]}
 */
export const PCP_CHANGE_REASONS = [
  'Relocating to a new area',
  'Provider no longer in network',
  'Scheduling or availability issues',
  'Prefer a different specialty or expertise',
  'Communication or language preference',
  'Dissatisfaction with current provider',
  'Recommendation from another provider',
  'Other',
];

/**
 * Hint text strings displayed in simulation mode to guide users.
 * @type {Object.<string, string>}
 */
export const SIMULATION_HINT_TEXT = {
  personalInfo: 'This is a simulated view of your personal information. Changes made here are stored locally and do not affect real records.',
  representatives: 'This is a simulated view of your authorized representatives. You can add or remove representatives for demonstration purposes.',
  privacySettings: 'This is a simulated view of your privacy settings. Adjustments here are for demonstration only.',
  communicationPreferences: 'This is a simulated view of your communication preferences. Updates are saved locally for demonstration purposes.',
  pcpChange: 'This is a simulated PCP change request. No actual provider changes will be submitted.',
  careManager: 'This is a simulated view of your care manager information. Contact details shown are for demonstration only.',
};