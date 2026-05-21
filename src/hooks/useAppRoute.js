import { useCallback, useEffect, useState } from 'react';
import { appRoutes, normalizeAppPath } from '../data/appRoutes';

function readPathname() {
  if (typeof window === 'undefined') {
    return appRoutes.home.path;
  }

  return normalizeAppPath(window.location.pathname);
}

export function useAppRoute() {
  const [pathname, setPathname] = useState(readPathname);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const syncPathname = () => {
      const normalizedPath = normalizeAppPath(window.location.pathname);

      if (window.location.pathname !== normalizedPath) {
        window.history.replaceState({}, '', normalizedPath);
      }

      setPathname(normalizedPath);
    };

    syncPathname();
    window.addEventListener('popstate', syncPathname);

    return () => window.removeEventListener('popstate', syncPathname);
  }, []);

  const navigate = useCallback(
    (nextPath) => {
      if (typeof window === 'undefined') {
        return;
      }

      const normalizedPath = normalizeAppPath(nextPath);

      if (normalizedPath === pathname) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      window.history.pushState({}, '', normalizedPath);
      setPathname(normalizedPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [pathname],
  );

  return {
    navigate,
    pathname,
  };
}
