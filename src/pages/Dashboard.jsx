import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { SimulationHint } from '../components/shared/SimulationHint.jsx';
import { SIMULATION_HINT_TEXT } from '../utils/constants.js';

/**
 * Quick-access navigation card definitions for the dashboard.
 * @type {Array<{ to: string, title: string, description: string, icon: React.ReactElement }>}
 */
const DASHBOARD_CARDS = [
  {
    to: '/personal-info',
    title: 'Personal Information',
    description: 'View and update your personal details, contact information, and plan details.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    ),
  },
  {
    to: '/representatives',
    title: 'Authorized Representatives',
    description: 'Manage the people authorized to act on your behalf regarding your health plan.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
        />
      </svg>
    ),
  },
  {
    to: '/privacy-security',
    title: 'Privacy & Security',
    description: 'Manage your password, security questions, and privacy preferences.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
  {
    to: '/communication-preferences',
    title: 'Communication Preferences',
    description: 'Manage how you receive notifications and communications from your health plan.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>
    ),
  },
  {
    to: '/pcp',
    title: 'Primary Care Provider',
    description: 'View your current PCP details and submit a change request if needed.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    ),
  },
  {
    to: '/care-manager',
    title: 'Care Manager',
    description: 'View your assigned care manager\'s contact information and availability.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
        />
      </svg>
    ),
  },
];

/**
 * Main dashboard/landing page after login for the CSNP Member Portal.
 * Displays a welcome message with the mock user's name, quick-access cards
 * linking to each section, and a global SimulationHint banner.
 * Accessible heading hierarchy and navigation cards.
 *
 * @returns {React.ReactElement} The Dashboard page component.
 */
export default function Dashboard() {
  const { user } = useAuth();

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
    : 'Member';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Welcome, {displayName}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Access and manage your health plan information from your member portal dashboard.
        </p>
      </div>

      {/* Simulation Hint */}
      <SimulationHint
        message={SIMULATION_HINT_TEXT.personalInfo}
        variant="banner"
      />

      {/* Quick Access Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DASHBOARD_CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="card group flex flex-col items-start gap-3 no-underline focus:outline-none focus:ring-2 focus:ring-csnp-500 focus:ring-offset-2 rounded-xl"
              aria-label={`Navigate to ${card.title}`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-csnp-50 text-csnp-600 transition-colors group-hover:bg-csnp-100">
                {card.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-csnp-600 transition-colors">
                  {card.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 leading-5">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Member Info Summary */}
      {user && (
        <div className="card">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-lg font-semibold text-gray-900">Account Summary</h2>
          </div>
          <dl className="mt-4 divide-y divide-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 py-3 last:border-b-0">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:text-right">{displayName}</dd>
            </div>
            {user.memberId && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 py-3 last:border-b-0">
                <dt className="text-sm font-medium text-gray-500">Member ID</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:text-right">{user.memberId}</dd>
              </div>
            )}
            {user.planName && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 py-3 last:border-b-0">
                <dt className="text-sm font-medium text-gray-500">Plan</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:text-right">{user.planName}</dd>
              </div>
            )}
            {user.email && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 py-3 last:border-b-0">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:text-right">{user.email}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}