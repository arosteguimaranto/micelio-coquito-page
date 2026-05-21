import { appRoutes } from './appRoutes';

export const heroMushrooms = [
  {
    id: 'portal-micelio',
    label: 'Micelio',
    title: 'Mapa de nodos',
    description: 'Abrí el recorrido principal y seguí la red completa.',
    route: appRoutes.micelio.path,
    anchor: [-1.28, -2.1, -0.24],
    scale: 0.88,
    capColor: '#8a674f',
    stemColor: '#f2dfca',
    gillColor: '#dcc6af',
    glowColor: '#fff1dd',
    tilt: 0.06,
    interactive: true,
  },
  {
    id: 'portal-playlist',
    label: 'Playlist',
    title: 'Ruta musical',
    description: 'Pasá a la parte musical del universo.',
    route: appRoutes.playlist.path,
    anchor: [1.98, -2.02, -0.48],
    scale: 0.64,
    capColor: '#b07f63',
    stemColor: '#efdbc4',
    gillColor: '#ddc1a4',
    glowColor: '#f8e6c8',
    tilt: 0.14,
    interactive: true,
  },
  {
    id: 'portal-prueba',
    label: 'Prueba',
    title: 'Sandbox',
    description: 'Ruta temporal para experimentar.',
    route: appRoutes.prueba.path,
    anchor: [0.92, 2.26, -0.34],
    scale: 0.68,
    capColor: '#b97d5a',
    stemColor: '#f3dec8',
    gillColor: '#dfc5ad',
    glowColor: '#ffebd3',
    tilt: 0.08,
    upsideDown: true,
    interactive: true,
    spots: {
      color: '#f6e2d0',
      count: 16,
      radius: 0.7,
      height: 0.3,
    },
  },
];

export const heroMyceliumConnections = [
  {
    id: 'micelio-playlist',
    from: 'portal-micelio',
    to: 'portal-playlist',
    via: [
      [-0.12, -2.32, 0.18],
      [0.82, -2.16, 0.42],
      [1.56, -2.04, 0.16],
    ],
    pulseCount: 3,
    speed: 0.135,
  },
  {
    id: 'micelio-prueba',
    from: 'portal-micelio',
    to: 'portal-prueba',
    via: [
      [-0.92, -0.62, 0.34],
      [-0.1, 0.56, 0.58],
      [0.52, 1.58, 0.26],
    ],
    pulseCount: 3,
    speed: 0.11,
  },
  {
    id: 'prueba-playlist',
    from: 'portal-prueba',
    to: 'portal-playlist',
    via: [
      [1.82, 1.66, 0.18],
      [2.34, 0.26, 0.48],
      [2.26, -1.06, 0.2],
    ],
    pulseCount: 2,
    speed: 0.12,
  },
];

export const heroNavigationTargets = heroMushrooms.filter((mushroom) => mushroom.route).map((mushroom) => ({
  description: mushroom.description,
  id: mushroom.id,
  label: mushroom.label,
  route: mushroom.route,
  title: mushroom.title,
}));
