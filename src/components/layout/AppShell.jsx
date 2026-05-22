import { layoutBaseBackground, phaseAuraColors, phaseBackgrounds, phaseGridColors, phaseLayerOpacities } from '../../data/phaseTheme';

const phaseIds = Object.keys(phaseBackgrounds);

export default function AppShell({ phaseId, children }) {
  return (
    <main className="app-surface">
      <div className="pointer-events-none absolute inset-0" style={{ background: layoutBaseBackground }} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(0,0,0,0.28),_transparent_48%)]" />

      {phaseIds.map((id) => {
        const isActive = id === phaseId;

        return (
          <div
            key={`bg-${id}`}
            className="pointer-events-none absolute inset-0 transition-opacity duration-[1600ms] ease-out"
            style={{
              background: phaseBackgrounds[id],
              filter: 'saturate(1.08) contrast(1.04)',
              opacity: isActive ? phaseLayerOpacities[id] ?? 0.8 : 0,
            }}
          />
        );
      })}

      {phaseIds.map((id) => {
        const isActive = id === phaseId;
        const auraColor = phaseAuraColors[id] ?? 'rgba(255,255,255,0.2)';

        return (
          <div
            key={`aura-${id}`}
            className="pointer-events-none absolute inset-0 blur-3xl transition-opacity duration-[1600ms] ease-out"
            style={{
              background: `radial-gradient(circle at 18% 22%, ${auraColor} 0%, transparent 34%), radial-gradient(circle at 82% 78%, ${auraColor} 0%, transparent 28%)`,
              opacity: isActive ? 0.72 : 0,
            }}
          />
        );
      })}

      {phaseIds.map((id) => {
        const isActive = id === phaseId;

        return (
          <div
            key={`grid-${id}`}
            className="pointer-events-none absolute inset-0 micelio-phase-grid transition-opacity duration-[1600ms] ease-out"
            style={{ '--phase-grid-color': phaseGridColors[id], opacity: isActive ? 0.34 : 0 }}
          />
        );
      })}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,_rgba(0,0,0,0.02)_0%,_rgba(0,0,0,0.12)_100%)]" />
      <div className="relative z-10 min-h-screen">{children}</div>
    </main>
  );
}
