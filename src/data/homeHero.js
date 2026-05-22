import { appRoutes } from './appRoutes';

export const heroHomePalette = {
  forest: '#255000',
  moss: '#588100',
  lime: '#8db600',
  crimson: '#9c0720',
  wine: '#710315',
  stem: '#efe5d4',
  gill: '#d9c6b4',
  paper: '#f2ede5',
};

const desktopMushrooms = [
  {
    id: 'portal-micelio',
    label: 'Micelio',
    title: 'Mapa de nodos',
    description: 'Abrí el recorrido principal y seguí la red completa.',
    route: appRoutes.micelio.path,
    anchor: [-4.78, 0.04, -0.56],
    scale: 0.84,
    capColor: heroHomePalette.moss,
    stemColor: heroHomePalette.stem,
    gillColor: heroHomePalette.gill,
    glowColor: heroHomePalette.lime,
    ringColor: '#d8cfb6',
    tilt: -0.08,
    capScale: [1.26, 0.72, 1.2],
    stemScale: [0.94, 1.12, 0.94],
    gillScale: [1.08, 0.48, 1.04],
    ringScale: [1.1, 1.06, 0.44],
    stemOffset: [0.04, 0, 0],
    interactionScale: 1.08,
    interactionHint: 'click para entrar',
    interactive: true,
  },
  {
    id: 'portal-playlist',
    label: 'Playlist',
    title: 'Ruta musical',
    description: 'Pasá a la parte musical del universo.',
    route: appRoutes.playlist.path,
    anchor: [-3.46, -2.72, -0.22],
    scale: 0.58,
    capColor: heroHomePalette.crimson,
    stemColor: heroHomePalette.stem,
    gillColor: '#d6b7b8',
    glowColor: '#bf3550',
    ringColor: '#ddc9be',
    tilt: 0.06,
    capScale: [0.96, 0.86, 0.94],
    stemScale: [0.88, 0.94, 0.88],
    gillScale: [0.92, 0.5, 0.9],
    ringScale: [0.94, 0.96, 0.4],
    stemOffset: [-0.03, 0, 0.02],
    interactionScale: 1.08,
    interactionHint: 'click para entrar',
    interactive: true,
  },
  {
    id: 'portal-prueba',
    label: 'Prueba',
    title: 'Sandbox',
    description: 'Ruta temporal para experimentar.',
    route: appRoutes.prueba.path,
    anchor: [4.82, 0.1, -0.58],
    scale: 0.86,
    capColor: heroHomePalette.wine,
    stemColor: heroHomePalette.stem,
    gillColor: '#d2bbb7',
    glowColor: heroHomePalette.crimson,
    ringColor: '#d7c3ba',
    tilt: 0.09,
    capScale: [1.18, 0.94, 1.18],
    stemScale: [0.98, 1.08, 0.98],
    gillScale: [1.02, 0.5, 1.02],
    ringScale: [1.04, 1.02, 0.4],
    stemOffset: [0.03, 0, 0],
    interactionScale: 1.08,
    interactionHint: 'click para entrar',
    interactive: true,
    spots: {
      color: heroHomePalette.paper,
      count: 12,
      radius: 0.62,
      height: 0.22,
    },
  },
];

const mobileMushrooms = [
  {
    ...desktopMushrooms[0],
    anchor: [-1.92, -1.08, -0.48],
    scale: 0.66,
    capScale: [1.1, 0.72, 1.08],
    stemScale: [0.88, 1.02, 0.88],
    gillScale: [0.98, 0.48, 0.96],
    ringScale: [1, 1, 0.4],
    interactionScale: 1.44,
    interactionHint: 'tap para entrar',
  },
  {
    ...desktopMushrooms[1],
    anchor: [0, -2.44, -0.18],
    scale: 0.54,
    capScale: [0.94, 0.84, 0.92],
    stemScale: [0.84, 0.92, 0.84],
    gillScale: [0.88, 0.48, 0.88],
    ringScale: [0.9, 0.92, 0.38],
    stemOffset: [-0.01, 0, 0],
    interactionScale: 1.5,
    interactionHint: 'tap para entrar',
  },
  {
    ...desktopMushrooms[2],
    anchor: [1.92, -1.06, -0.48],
    scale: 0.66,
    capScale: [1.1, 0.92, 1.1],
    stemScale: [0.9, 1.02, 0.9],
    gillScale: [0.96, 0.5, 0.96],
    ringScale: [0.98, 0.98, 0.38],
    interactionScale: 1.44,
    interactionHint: 'tap para entrar',
  },
];

const desktopConnections = [
  {
    id: 'micelio-playlist',
    from: 'portal-micelio',
    to: 'portal-playlist',
    via: [
      [-4.46, -1.62, 0.14],
      [-3.98, -2.24, 0.28],
      [-3.64, -2.54, 0.14],
    ],
    pulseCount: 2,
    speed: 0.11,
  },
  {
    id: 'micelio-prueba',
    from: 'portal-micelio',
    to: 'portal-prueba',
    via: [
      [-2.62, -3.26, 0.2],
      [0.08, -3.46, 0.38],
      [2.9, -3.16, 0.14],
    ],
    pulseCount: 3,
    speed: 0.108,
  },
  {
    id: 'prueba-playlist',
    from: 'portal-prueba',
    to: 'portal-playlist',
    via: [
      [2.26, -3.08, 0.18],
      [-0.1, -3.38, 0.34],
      [-2.1, -3.08, 0.2],
    ],
    pulseCount: 2,
    speed: 0.1,
  },
];

const mobileConnections = [
  {
    id: 'micelio-playlist',
    from: 'portal-micelio',
    to: 'portal-playlist',
    via: [
      [-1.46, -1.62, 0.16],
      [-0.86, -2.08, 0.3],
      [-0.32, -2.28, 0.16],
    ],
    pulseCount: 2,
    speed: 0.11,
  },
  {
    id: 'micelio-prueba',
    from: 'portal-micelio',
    to: 'portal-prueba',
    via: [
      [-0.88, -1.16, 0.22],
      [0, -0.98, 0.34],
      [0.88, -1.14, 0.18],
    ],
    pulseCount: 2,
    speed: 0.105,
  },
  {
    id: 'prueba-playlist',
    from: 'portal-prueba',
    to: 'portal-playlist',
    via: [
      [1.46, -1.6, 0.14],
      [0.86, -2.06, 0.28],
      [0.32, -2.26, 0.16],
    ],
    pulseCount: 2,
    speed: 0.102,
  },
];

export const heroSceneLayouts = {
  desktop: {
    sparkles: { count: 38, opacity: 0.28, scale: [13, 8, 6], size: 1.35, speed: 0.18 },
    backgroundOrbs: [
      { key: 'left', position: [-4.8, 0.15, -5.1], scale: [2.7, 2.7, 2.7], color: heroHomePalette.moss, opacity: 0.16 },
      { key: 'center', position: [0.1, -1.48, -5.3], scale: [2.8, 2.8, 2.8], color: heroHomePalette.wine, opacity: 0.11 },
      { key: 'right', position: [4.85, 0.08, -4.9], scale: [2.8, 2.8, 2.8], color: heroHomePalette.crimson, opacity: 0.16 },
    ],
    groupPosition: [0, -0.18, 0],
    mushrooms: desktopMushrooms,
    connections: desktopConnections,
  },
  mobile: {
    sparkles: { count: 28, opacity: 0.22, scale: [8, 11.5, 6], size: 1.05, speed: 0.14 },
    backgroundOrbs: [
      { key: 'left', position: [-2.8, -0.2, -4.9], scale: [2.05, 2.05, 2.05], color: heroHomePalette.moss, opacity: 0.14 },
      { key: 'center', position: [0.05, -1.42, -5.1], scale: [2.35, 2.35, 2.35], color: heroHomePalette.wine, opacity: 0.09 },
      { key: 'right', position: [2.85, -0.16, -4.85], scale: [2.05, 2.05, 2.05], color: heroHomePalette.crimson, opacity: 0.14 },
    ],
    groupPosition: [0, -0.52, 0],
    mushrooms: mobileMushrooms,
    connections: mobileConnections,
  },
};

export const heroMushrooms = heroSceneLayouts.desktop.mushrooms;
export const heroMyceliumConnections = heroSceneLayouts.desktop.connections;

export const heroNavigationTargets = heroMushrooms.filter((mushroom) => mushroom.route).map((mushroom) => ({
  description: mushroom.description,
  id: mushroom.id,
  label: mushroom.label,
  route: mushroom.route,
  title: mushroom.title,
}));
