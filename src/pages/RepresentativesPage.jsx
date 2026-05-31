import { useEffect } from 'react';
import Layout from '../components/shared/Layout.jsx';
import Representatives from '../components/account/Representatives.jsx';

/**
 * Page wrapper for the Representatives component.
 * Renders Layout with Representatives as content.
 * Handles page-level concerns like document title.
 *
 * @returns {React.ReactElement} The RepresentativesPage component.
 */
export default function RepresentativesPage() {
  const appTitle = import.meta.env.VITE_APP_TITLE || 'CSNP Member Portal';

  useEffect(() => {
    document.title = `Authorized Representatives | ${appTitle}`;
  }, [appTitle]);

  return (
    <Layout>
      <Representatives />
    </Layout>
  );
}