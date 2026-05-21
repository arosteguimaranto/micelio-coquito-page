import { Canvas } from '@react-three/fiber';
import HeroMicelioScene from './HeroMicelioScene';

export default function HeroMicelioCanvas({ onNavigate }) {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0.15, 0, 10.8], fov: 35 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#1e140f']} />
        <fog attach="fog" args={['#1f140f', 9, 22]} />
        <ambientLight intensity={1.12} color="#fff2df" />
        <directionalLight position={[-3, 4.5, 5]} intensity={2.2} color="#ffe5ca" />
        <pointLight position={[4.8, 2.6, 5.5]} intensity={26} color="#ffcfaf" />
        <pointLight position={[-4.6, -1.8, 4.2]} intensity={18} color="#f5d2b8" />
        <pointLight position={[0, 0.5, 6]} intensity={12} color="#fff0d8" />
        <HeroMicelioScene onNavigate={onNavigate} />
      </Canvas>
    </div>
  );
}
