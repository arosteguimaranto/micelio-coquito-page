export default function AppShell({ phaseId, children }) {
  return (
    <main className={`app-surface phase-gradient phase-${phaseId}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.24),_transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(70,44,120,0.28),_transparent_45%)]" />
      <div className="relative z-10 min-h-screen">{children}</div>
    </main>
  );
}
