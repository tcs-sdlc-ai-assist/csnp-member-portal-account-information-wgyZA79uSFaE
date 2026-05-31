/**
 * Central mock data definitions for the CSNP Member Portal.
 * All PII is obviously fake and intended for demonstration purposes only.
 * All dates are relative to the reference date (2024-06-10).
 * @module mockData
 */

import { formatDate, getRelativeDate } from '../utils/dateReference.js';

/**
 * Default personal information for the simulated member.
 * @type {Object}
 */
export const defaultPersonalInfo = {
  firstName: 'Jane',
  lastName: 'Doe',
  dateOfBirth: '1952-03-15',
  memberId: 'CSNP8834721',
  email: 'jane.doe@fakeemail.com',
  phone: '(555) 867-5309',
  address: '742 Evergreen Terrace, Springfield, IL 62704',
  preferredLanguage: 'English',
  planName: 'CSNP Premier Gold',
  planId: 'CSNP-PG-2024',
  effectiveDate: formatDate(getRelativeDate(-180), 'YYYY-MM-DD'),
  groupNumber: 'GRP-00482',
};

/**
 * Default authorized representatives for the simulated member.
 * @type {Array<Object>}
 */
export const defaultRepresentatives = [
  {
    id: 'rep-001',
    name: 'John Doe',
    relationship: 'Spouse',
    phone: '(555) 867-5310',
    email: 'john.doe@fakeemail.com',
    authorizedDate: formatDate(getRelativeDate(-120), 'YYYY-MM-DD'),
    permissions: ['View Claims', 'Speak on Behalf', 'Receive Mail'],
  },
  {
    id: 'rep-002',
    name: 'Emily Doe-Smith',
    relationship: 'Daughter',
    phone: '(555) 234-5678',
    email: 'emily.doesmith@fakeemail.com',
    authorizedDate: formatDate(getRelativeDate(-60), 'YYYY-MM-DD'),
    permissions: ['View Claims', 'Schedule Appointments'],
  },
];

/**
 * Default privacy settings for the simulated member.
 * @type {Object}
 */
export const defaultPrivacySettings = {
  passwordHint: 'Favorite childhood pet',
  securityQuestions: [
    {
      question: 'What was the name of your first pet?',
      answer: 'Whiskers',
    },
    {
      question: 'What city were you born in?',
      answer: 'Springfield',
    },
    {
      question: 'What is your mother\'s maiden name?',
      answer: 'Johnson',
    },
  ],
  twoFactorEnabled: true,
  lastPasswordChange: formatDate(getRelativeDate(-45), 'YYYY-MM-DD'),
  hipaaAuthorizationsOnFile: true,
  shareDataWithProviders: true,
  allowResearchUse: false,
};

/**
 * Default communication preferences for the simulated member.
 * @type {Object}
 */
export const defaultCommunicationPreferences = {
  paperless: true,
  deliveryEmail: 'jane.doe@fakeemail.com',
  categoryPreferences: [
    {
      category: 'Benefits Updates',
      methods: ['Email', 'Portal Message'],
      enabled: true,
    },
    {
      category: 'Claims & Billing',
      methods: ['Email', 'Mail'],
      enabled: true,
    },
    {
      category: 'Appointments & Reminders',
      methods: ['Text Message (SMS)', 'Email'],
      enabled: true,
    },
    {
      category: 'Plan Changes',
      methods: ['Email', 'Mail'],
      enabled: true,
    },
    {
      category: 'Wellness & Health Tips',
      methods: ['Email'],
      enabled: false,
    },
    {
      category: 'Pharmacy & Prescriptions',
      methods: ['Text Message (SMS)', 'Portal Message'],
      enabled: true,
    },
    {
      category: 'Authorization Status',
      methods: ['Email', 'Phone Call'],
      enabled: true,
    },
    {
      category: 'General Announcements',
      methods: ['Portal Message'],
      enabled: false,
    },
  ],
  preferredLanguage: 'English',
  doNotCallHours: {
    start: '21:00',
    end: '08:00',
  },
};

/**
 * Default PCP (Primary Care Provider) information for the simulated member.
 * @type {Object}
 */
export const defaultPCPInfo = {
  name: 'Dr. Robert Chen',
  specialty: 'Internal Medicine',
  phone: '(555) 444-2200',
  fax: '(555) 444-2201',
  email: 'dr.chen@fakemedical.com',
  address: '100 Medical Plaza, Suite 210, Springfield, IL 62701',
  npi: '1234567890',
  effectiveDate: formatDate(getRelativeDate(-180), 'YYYY-MM-DD'),
  acceptingNewPatients: true,
  languages: ['English', 'Mandarin'],
  officeHours: 'Mon–Fri 8:00 AM – 5:00 PM',
};

/**
 * Default care manager information for the simulated member.
 * @type {Object}
 */
export const defaultCareManagerInfo = {
  name: 'Sarah Williams, RN',
  phone: '(555) 321-9876',
  email: 'sarah.williams@fakehealth.com',
  assignedDate: formatDate(getRelativeDate(-90), 'YYYY-MM-DD'),
  department: 'Chronic Care Management',
  availability: 'Mon–Fri 9:00 AM – 4:00 PM',
  nextScheduledCall: formatDate(getRelativeDate(7), 'YYYY-MM-DD'),
};

/**
 * Default list of doctors for the Hospital/Provider Finder feature.
 * @type {Array<Object>}
 */
export const defaultDoctorList = [
  {
    id: 'doc-001',
    name: 'Dr. Robert Chen',
    specialty: 'Internal Medicine',
    phone: '(555) 444-2200',
    address: '100 Medical Plaza, Suite 210, Springfield, IL 62701',
    distance: '2.3 miles',
    acceptingNewPatients: true,
    rating: 4.8,
    languages: ['English', 'Mandarin'],
    networkStatus: 'In-Network',
  },
  {
    id: 'doc-002',
    name: 'Dr. Maria Gonzalez',
    specialty: 'Cardiology',
    phone: '(555) 555-1100',
    address: '250 Heart Center Drive, Springfield, IL 62702',
    distance: '4.1 miles',
    acceptingNewPatients: true,
    rating: 4.9,
    languages: ['English', 'Spanish'],
    networkStatus: 'In-Network',
  },
  {
    id: 'doc-003',
    name: 'Dr. James Patel',
    specialty: 'Endocrinology',
    phone: '(555) 678-3300',
    address: '75 Wellness Blvd, Suite 400, Springfield, IL 62703',
    distance: '5.7 miles',
    acceptingNewPatients: false,
    rating: 4.6,
    languages: ['English', 'Hindi', 'Gujarati'],
    networkStatus: 'In-Network',
  },
  {
    id: 'doc-004',
    name: 'Dr. Angela Brooks',
    specialty: 'Geriatric Medicine',
    phone: '(555) 789-4400',
    address: '320 Senior Care Lane, Springfield, IL 62704',
    distance: '3.0 miles',
    acceptingNewPatients: true,
    rating: 4.7,
    languages: ['English'],
    networkStatus: 'In-Network',
  },
  {
    id: 'doc-005',
    name: 'Dr. Kevin Nguyen',
    specialty: 'Pulmonology',
    phone: '(555) 890-5500',
    address: '500 Respiratory Way, Suite 150, Springfield, IL 62701',
    distance: '6.2 miles',
    acceptingNewPatients: true,
    rating: 4.5,
    languages: ['English', 'Vietnamese'],
    networkStatus: 'In-Network',
  },
];