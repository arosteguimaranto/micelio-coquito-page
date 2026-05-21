import { phaseAuraColors, phaseBackgrounds, phaseGridColors } from '../../data/phaseTheme';

const phaseIds = Object.keys(phaseBackgrounds);

export default function AppShell({ phaseId, children }) {
  const topOverlay =
    phaseId === 'home'
      ? 'radial-gradient(circle_at_top,_rgba(141,182,0,0.18),_transparent_40%)'
      : 'radial-gradient(circle_at_top,_rgba(255,255,255,0.24),_transparent_40%)';
  const bottomOverlay =
    phaseId === 'home'
      ? 'radial-gradient(circle_at_bottom,_rgba(156,7,32,0.24),_transparent_45%)'
      : 'radial-gradient(circle_at_bottom,_rgba(70,44,120,0.28),_transparent_45%)';

  return (
    <main className="app-surface">
      {phaseIds.map((id) => {
        const isActive = id === phaseId;

        return (
          <div
            key={`bg-${id}`}
            className="pointer-events-none absolute inset-0 transition-opacity duration-[1400ms] ease-out"
            style={{ background: phaseBackgrounds[id], opacity: isActive ? 1 : 0 }}
          />
        );
      })}

      <div className="pointer-events-none absolute inset-0" style={{ background: topOverlay }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: bottomOverlay }} />

      {phaseIds.map((id) => {
        const isActive = id === phaseId;
        const auraColor = phaseAuraColors[id] ?? 'rgba(255,255,255,0.2)';

        return (
          <div
            key={`aura-${id}`}
            className="pointer-events-none absolute inset-0 blur-3xl transition-opacity duration-[1400ms] ease-out"
            style={{
              background: `radial-gradient(circle at 18% 22%, ${auraColor} 0%, transparent 34%), radial-gradient(circle at 82% 78%, ${auraColor} 0%, transparent 28%)`,
              opacity: isActive ? 0.9 : 0,
            }}
          />
        );
      })}

      {phaseIds.map((id) => {
        const isActive = id === phaseId;

        return (
          <div
            key={`grid-${id}`}
            className="pointer-events-none absolute inset-0 micelio-phase-grid transition-opacity duration-[1400ms] ease-out"
            style={{ '--phase-grid-color': phaseGridColors[id], opacity: isActive ? 0.6 : 0 }}
          />
        );
      })}

      <div className="relative z-10 min-h-screen">{children}</div>
    </main>
  );
}
