import { useEffect } from 'react';
import Layout from '../components/shared/Layout.jsx';
import PersonalInfo from '../components/account/PersonalInfo.jsx';

/**
 * Page wrapper for the PersonalInfo component.
 * Renders Layout with PersonalInfo as content.
 * Handles page-level concerns like document title.
 *
 * @returns {React.ReactElement} The PersonalInfoPage component.
 */
export default function PersonalInfoPage() {
  const appTitle = import.meta.env.VITE_APP_TITLE || 'CSNP Member Portal';

  useEffect(() => {
    document.title = `Personal Information | ${appTitle}`;
  }, [appTitle]);

  return (
    <Layout>
      <PersonalInfo />
    </Layout>
  );
}