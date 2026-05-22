import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import HeroMicelioScene from './HeroMicelioScene';

export default function HeroMicelioCanvas({ onNavigate }) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false,
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const syncMatch = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', syncMatch);
      return () => mediaQuery.removeEventListener('change', syncMatch);
    }

    mediaQuery.addListener(syncMatch);
    return () => mediaQuery.removeListener(syncMatch);
  }, []);

  const camera = isMobile
    ? { position: [0, -0.12, 14.8], fov: 43.5 }
    : { position: [0, -0.05, 12.8], fov: 34.5 };

  return (
    <div className="absolute inset-0">
      <Canvas key={isMobile ? 'hero-mobile' : 'hero-desktop'} camera={camera} dpr={isMobile ? [1, 1.25] : [1, 1.5]}>
        <color attach="background" args={['#071003']} />
        <fog attach="fog" args={['#081104', 11, 25]} />
        <ambientLight intensity={0.92} color="#dbe8ca" />
        <directionalLight position={[-4.5, 4.2, 5]} intensity={1.8} color="#8db600" />
        <pointLight position={[4.9, 3.2, 5.4]} intensity={22} color="#9c0720" />
        <pointLight position={[-5.2, -1.4, 4.1]} intensity={18} color="#588100" />
        <pointLight position={[0, 1.1, 5.8]} intensity={10} color="#f3e7cf" />
        <HeroMicelioScene onNavigate={onNavigate} />
      </Canvas>
    </div>
  );
}
