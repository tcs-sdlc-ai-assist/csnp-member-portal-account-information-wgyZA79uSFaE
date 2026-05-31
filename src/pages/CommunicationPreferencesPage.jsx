import { useEffect } from 'react';
import Layout from '../components/shared/Layout.jsx';
import CommunicationPreferences from '../components/account/CommunicationPreferences.jsx';
import { CommunicationPreferencesProvider } from '../contexts/CommunicationPreferencesContext.jsx';

/**
 * Page wrapper for the CommunicationPreferences component.
 * Renders Layout with CommunicationPreferences as content.
 * Wraps content in CommunicationPreferencesProvider for context access.
 * Handles page-level concerns like document title.
 *
 * @returns {React.ReactElement} The CommunicationPreferencesPage component.
 */
export default function CommunicationPreferencesPage() {
  const appTitle = import.meta.env.VITE_APP_TITLE || 'CSNP Member Portal';

  useEffect(() => {
    document.title = `Communication Preferences | ${appTitle}`;
  }, [appTitle]);

  return (
    <Layout>
      <CommunicationPreferencesProvider>
        <CommunicationPreferences />
      </CommunicationPreferencesProvider>
    </Layout>
  );
}