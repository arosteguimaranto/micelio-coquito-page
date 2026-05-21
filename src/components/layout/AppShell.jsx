import { phaseAuraColors, phaseGridColors } from '../../data/phaseTheme';

export default function AppShell({ phaseId, children }) {
  const auraColor = phaseAuraColors[phaseId] ?? 'rgba(255,255,255,0.2)';
  const gridColor = phaseGridColors[phaseId] ?? 'rgba(255,255,255,0.08)';

  return (
    <main className={`app-surface phase-gradient phase-${phaseId}`} style={{ '--phase-grid-color': gridColor }}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.24),_transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(70,44,120,0.28),_transparent_45%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-90 blur-3xl transition duration-[1400ms]"
        style={{
          background: `radial-gradient(circle at 18% 22%, ${auraColor} 0%, transparent 34%), radial-gradient(circle at 82% 78%, ${auraColor} 0%, transparent 28%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 micelio-phase-grid opacity-60" />
      <div className="relative z-10 min-h-screen">{children}</div>
    </main>
  );
}
