import { useEffect } from 'react';
import Layout from '../components/shared/Layout.jsx';
import PCPInfo from '../components/pcp/PCPInfo.jsx';

/**
 * Page wrapper for the PCPInfo component.
 * Renders Layout with PCPInfo as content.
 * Handles page-level concerns like document title.
 *
 * @returns {React.ReactElement} The PCPPage component.
 */
export default function PCPPage() {
  const appTitle = import.meta.env.VITE_APP_TITLE || 'CSNP Member Portal';

  useEffect(() => {
    document.title = `Primary Care Provider | ${appTitle}`;
  }, [appTitle]);

  return (
    <Layout>
      <PCPInfo />
    </Layout>
  );
}