import HeroMicelioCanvas from './HeroMicelioCanvas';

export default function HeroMicelioStage({ onNavigate }) {
  return (
    <div className="home-hero-stage">
      <HeroMicelioCanvas onNavigate={onNavigate} />
      <div className="pointer-events-none absolute inset-0 home-hero-vignette" />
      <div className="pointer-events-none absolute inset-0 home-hero-noise" />
    </div>
  );
}
