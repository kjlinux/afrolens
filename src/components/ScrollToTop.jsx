import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Composant qui remonte automatiquement en haut de la page
 * lors d'un changement de route
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Remonte en haut de la page à chaque changement de route
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
