import { useEffect } from 'react';
import Layout from '../components/shared/Layout.jsx';
import CareManagerInfo from '../components/account/CareManagerInfo.jsx';
import { CareManagerProvider } from '../contexts/CareManagerContext.jsx';

/**
 * Page wrapper for the CareManagerInfo component.
 * Renders Layout with CareManagerInfo as content.
 * Wraps content in CareManagerProvider for context access.
 * Handles page-level concerns like document title.
 *
 * @returns {React.ReactElement} The CareManagerPage component.
 */
export default function CareManagerPage() {
  const appTitle = import.meta.env.VITE_APP_TITLE || 'CSNP Member Portal';

  useEffect(() => {
    document.title = `Care Manager | ${appTitle}`;
  }, [appTitle]);

  return (
    <Layout>
      <CareManagerProvider>
        <CareManagerInfo />
      </CareManagerProvider>
    </Layout>
  );
}