import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ScrollToTop: scrolls window to top on route change
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use a small timeout to allow layout/render to complete
    // so scroll happens after the new view is mounted.
    const t = setTimeout(() => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      } catch (e) {
        // fallback for older browsers
        window.scrollTo(0, 0);
      }
    }, 0);

    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
