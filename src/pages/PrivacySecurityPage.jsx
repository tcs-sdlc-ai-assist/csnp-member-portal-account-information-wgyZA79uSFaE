import { useEffect } from 'react';
import Layout from '../components/shared/Layout.jsx';
import PrivacySecurity from '../components/account/PrivacySecurity.jsx';

/**
 * Page wrapper for the PrivacySecurity component.
 * Renders Layout with PrivacySecurity as content.
 * Handles page-level concerns like document title.
 *
 * @returns {React.ReactElement} The PrivacySecurityPage component.
 */
export default function PrivacySecurityPage() {
  const appTitle = import.meta.env.VITE_APP_TITLE || 'CSNP Member Portal';

  useEffect(() => {
    document.title = `Privacy & Security | ${appTitle}`;
  }, [appTitle]);

  return (
    <Layout>
      <PrivacySecurity />
    </Layout>
  );
}