export const appRoutes = {
  home: {
    id: 'home',
    path: '/',
    phaseId: 'home',
    label: 'Inicio',
    title: 'Home',
    description: 'Puerta de entrada al recorrido completo.',
  },
  micelio: {
    id: 'micelio',
    path: '/micelio',
    phaseId: 'amanecer',
    label: 'Micelio',
    title: 'Mapa de nodos',
    description: 'Entrá al recorrido principal y seguí la red completa de percepciones.',
    badge: 'Recorrido principal',
  },
  playlist: {
    id: 'playlist',
    path: '/playlist',
    phaseId: 'tarde',
    label: 'Playlist',
    title: 'Playlist',
    description: 'Ruta musical reservada para lo que acompaña el mood de todo este micelio.',
    badge: 'Ruta secundaria',
  },
  prueba: {
    id: 'prueba',
    path: '/prueba',
    phaseId: 'noche',
    label: 'Prueba',
    title: 'Ruta prueba',
    description: 'Espacio temporal para experimentar con otra capa del proyecto sin romper lo demás.',
    badge: 'Sandbox',
  },
};

export const homeRouteDestinations = [appRoutes.micelio, appRoutes.playlist, appRoutes.prueba];
export const validAppPaths = Object.values(appRoutes).map((route) => route.path);

export function normalizeAppPath(pathname = '/') {
  return validAppPaths.includes(pathname) ? pathname : appRoutes.home.path;
}

export function getAppRouteByPath(pathname = '/') {
  const normalizedPath = normalizeAppPath(pathname);

  return Object.values(appRoutes).find((route) => route.path === normalizedPath) ?? appRoutes.home;
}
